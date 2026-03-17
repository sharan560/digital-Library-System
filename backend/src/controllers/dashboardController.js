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
    monthlyIssuesRaw,
  ] = await Promise.all([
    Book.countDocuments(),
    Transaction.countDocuments({ status: { $in: ["issued", "overdue"] } }),
    Transaction.countDocuments({ status: { $in: ["issued", "overdue"] }, dueDate: { $lt: now } }),
    User.countDocuments({ isActive: true, role: "member" }),
    Transaction.aggregate([
      { $match: { status: "returned", fine: { $gt: 0 } } },
      { $group: { _id: null, totalFine: { $sum: "$fine" } } },
    ]),
    Book.find().sort({ borrowCount: -1 }).limit(5).select("title borrowCount author"),
    Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$issueDate" },
            month: { $month: "$issueDate" },
          },
          issues: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const monthlyIssues = monthlyIssuesRaw.map((entry) => {
    const year = entry._id.year;
    const month = entry._id.month;
    const monthName = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
      month: "short",
    });

    return {
      year,
      month,
      monthName,
      label: `${monthName} ${year}`,
      issues: entry.issues,
    };
  });

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
