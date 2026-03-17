const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Transaction = require("../src/models/Transaction");
const User = require("../src/models/User");
const Book = require("../src/models/Book");
const { calculateFine } = require("../src/utils/fine");

dotenv.config();

const seedBackdatedIssues = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const members = await User.find({ role: "member", isActive: true }).select("_id name").lean();
  const books = await Book.find({}).select("_id title borrowCount").lean();

  if (!members.length || !books.length) {
    throw new Error("Need at least one active member and one book");
  }

  const monthOffsets = [1, 2, 3, 4, 5, 6, 7, 8];
  const docs = [];
  const borrowBump = {};

  for (let i = 0; i < 24; i += 1) {
    const member = members[i % members.length];
    const book = books[i % books.length];
    const offset = monthOffsets[i % monthOffsets.length];

    const issueDate = new Date();
    issueDate.setHours(10, 0, 0, 0);
    issueDate.setMonth(issueDate.getMonth() - offset);
    issueDate.setDate(((i * 3) % 25) + 1);

    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 14);

    let status = "returned";
    let returnDate = new Date(dueDate);
    returnDate.setDate(returnDate.getDate() + (i % 5));
    let fine = calculateFine(dueDate, returnDate);

    if (i % 7 === 0) {
      status = "overdue";
      returnDate = undefined;
      fine = calculateFine(dueDate, new Date());
    } else if (i % 5 === 0) {
      status = "issued";
      returnDate = undefined;
      fine = 0;
    }

    docs.push({
      userId: member._id,
      bookId: book._id,
      issueDate,
      dueDate,
      returnDate,
      fine,
      status,
      isFinePaid: false,
      createdAt: issueDate,
      updatedAt: returnDate || issueDate,
    });

    const bookKey = String(book._id);
    borrowBump[bookKey] = (borrowBump[bookKey] || 0) + 1;
  }

  const inserted = await Transaction.insertMany(docs, { ordered: false });

  const ops = Object.entries(borrowBump).map(([bookId, count]) => ({
    updateOne: {
      filter: { _id: bookId },
      update: { $inc: { borrowCount: count } },
    },
  }));

  if (ops.length > 0) {
    await Book.bulkWrite(ops);
  }

  const monthly = await Transaction.aggregate([
    {
      $group: {
        _id: { $month: "$issueDate" },
        issues: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  console.log("Inserted backdated transactions:", inserted.length);
  console.log("Monthly issue buckets now:", JSON.stringify(monthly));

  await mongoose.disconnect();
};

seedBackdatedIssues().catch(async (error) => {
  console.error("SEED_FAILED:", error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // no-op
  }
  process.exit(1);
});
