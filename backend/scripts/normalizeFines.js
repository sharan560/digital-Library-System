const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Transaction = require("../src/models/Transaction");

dotenv.config();

const getFineSummary = async () => {
  const txs = await Transaction.find({}).select("status fine").lean();
  let totalFine = 0;
  let returnedFine = 0;

  txs.forEach((tx) => {
    const fine = Number(tx.fine || 0);
    totalFine += fine;
    if (tx.status === "returned") {
      returnedFine += fine;
    }
  });

  return { totalFine, returnedFine };
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const before = await getFineSummary();

  await Transaction.updateMany(
    { status: "returned", fine: { $gt: 200 } },
    { $set: { fine: 200 } }
  );

  await Transaction.updateMany(
    { status: { $in: ["issued", "overdue"] }, fine: { $gt: 300 } },
    { $set: { fine: 300 } }
  );

  const after = await getFineSummary();

  console.log("Before fines:", JSON.stringify(before));
  console.log("After fines:", JSON.stringify(after));

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("NORMALIZE_FAILED:", error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
