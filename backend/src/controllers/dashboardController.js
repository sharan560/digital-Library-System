const Book = require("../models/Book");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const asyncHandler = require("../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const now = new Date();

  const [
    totalBooks,
    issuedBooks,
    overdueBooks,
    activeUsers,
    fineResult,
    topBorrowed,
    monthlyIssues,
  ] = await Promise.all([
    Book.countDocuments(),
    Transaction.countDocuments({ status: { $in: ["issued", "overdue"] } }),
    Transaction.countDocuments({ status: { $in: ["issued", "overdue"] }, dueDate: { $lt: now } }),
    User.countDocuments({ isActive: true, role: "member" }),
    Transaction.aggregate([
      { $match: { fine: { $gt: 0 } } },
      { $group: { _id: null, totalFine: { $sum: "$fine" } } },
    ]),
    Book.find().sort({ borrowCount: -1 }).limit(5).select("title borrowCount author"),
    Transaction.aggregate([
      {
        $group: {
          _id: { $month: "$issueDate" },
          issues: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalBooks,
      issuedBooks,
      overdueBooks,
      activeUsers,
      fineCollected: fineResult[0]?.totalFine || 0,
      topBorrowed,
      monthlyIssues,
    },
  });
});

module.exports = { getAdminDashboard };
