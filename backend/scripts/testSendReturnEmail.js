const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const app = require("../src/app");
const User = require("../src/models/User");
const Transaction = require("../src/models/Transaction");

dotenv.config();

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const run = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in backend/.env");
  }

  await connectDB();

  const admin = await User.findOne({ role: "admin", isActive: true }).select("_id email role");
  if (!admin) {
    throw new Error("No active admin user found. Create an admin user first.");
  }

  const tx = await Transaction.findOne({ status: { $in: ["issued", "overdue"] } })
    .populate("userId", "name email emailNotificationsOptIn")
    .populate("bookId", "title")
    .sort({ createdAt: -1 });

  if (!tx) {
    throw new Error("No issued/overdue transaction found to test with.");
  }

  if (!tx.userId?.email) {
    throw new Error("Selected transaction has no user email.");
  }

  if (tx.userId.emailNotificationsOptIn === false) {
    throw new Error("Selected user has opted out of email notifications.");
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const today = new Date();
  const baseDate = tx.issueDate > today ? new Date(tx.issueDate) : today;
  // Add one day so date-only payload remains safely after issue timestamp.
  baseDate.setDate(baseDate.getDate() + 1);
  const returnDate = toDateInput(baseDate);

  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 5000;

  const endpoint = `http://127.0.0.1:${port}/api/transactions/${tx._id}/send-return-email`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ returnDate }),
    });

    const payload = await response.json();

    console.log("TEST_TRANSACTION_ID:", String(tx._id));
    console.log("TEST_TRANSACTION_USER:", tx.userId.email);
    console.log("TEST_TRANSACTION_BOOK:", tx.bookId?.title || "Unknown");
    console.log("HTTP_STATUS:", response.status);
    console.log("RESPONSE_PAYLOAD:");
    console.log(JSON.stringify(payload, null, 2));

    if (!response.ok) {
      process.exitCode = 1;
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await mongoose.disconnect();
  }
};

run().catch(async (error) => {
  console.error("EMAIL_TEST_FAILED:", error.message);
  try {
    await mongoose.disconnect();
  } catch (disconnectError) {
    // no-op
  }
  process.exit(1);
});
