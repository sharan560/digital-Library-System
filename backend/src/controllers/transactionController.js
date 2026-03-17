const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { calculateFine } = require("../utils/fine");
const { sendReturnEstimateEmail } = require("../services/emailService");
const BORROW_DAYS = Number(process.env.BORROW_DAYS || 14);

const issueBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.body.bookId || req.params.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.availableCopies < 1) {
    res.status(400);
    throw new Error("Book unavailable, place a reservation");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

  const tx = await Transaction.create({
    userId: req.user._id,
    bookId: book._id,
    dueDate,
  });

  book.availableCopies -= 1;
  book.availability = book.availableCopies > 0;
  book.borrowCount += 1;
  await book.save();

  const populatedTx = await Transaction.findById(tx._id)
    .populate("userId", "name email")
    .populate("bookId", "title author coverImage genre");

  res.status(201).json({ success: true, data: populatedTx });
});

const returnBook = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admin can return this book");
  }

  const tx = await Transaction.findById(req.params.id);

  if (!tx) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (tx.status === "returned") {
    res.status(400);
    throw new Error("Book already returned");
  }

  const providedReturnDate = req.body.returnDate;
  let effectiveReturnDate = new Date();

  if (providedReturnDate) {
    const parsedDate = new Date(providedReturnDate);
    if (Number.isNaN(parsedDate.getTime())) {
      res.status(400);
      throw new Error("Invalid return date format");
    }
    effectiveReturnDate = parsedDate;
  }

  if (effectiveReturnDate < tx.issueDate) {
    res.status(400);
    throw new Error("Return date cannot be before issue date");
  }

  tx.returnDate = effectiveReturnDate;
  tx.fine = calculateFine(tx.dueDate, effectiveReturnDate);
  tx.status = "returned";
  await tx.save();

  const book = await Book.findById(tx.bookId);
  if (book) {
    book.availableCopies += 1;
    book.availability = true;
    await book.save();

    const nextReservation = await Reservation.findOne({
      bookId: book._id,
      status: "active",
    }).sort({ queuePosition: 1, createdAt: 1 });

    if (nextReservation) {
      const nextDueDate = new Date();
      nextDueDate.setDate(nextDueDate.getDate() + BORROW_DAYS);

      await Transaction.create({
        userId: nextReservation.userId,
        bookId: book._id,
        dueDate: nextDueDate,
      });

      nextReservation.status = "fulfilled";
      await nextReservation.save();

      book.availableCopies = Math.max(0, book.availableCopies - 1);
      book.availability = book.availableCopies > 0;
      book.borrowCount += 1;
      await book.save();

      await normalizeQueue(book._id);
    }
  }

  const populatedTx = await Transaction.findById(tx._id)
    .populate("userId", "name email")
    .populate("bookId", "title author coverImage genre");

  res.json({ success: true, data: populatedTx });
});

const normalizeQueue = async (bookId) => {
  const activeReservations = await Reservation.find({ bookId, status: "active" }).sort({
    queuePosition: 1,
    createdAt: 1,
  });

  await Promise.all(
    activeReservations.map((item, index) =>
      Reservation.findByIdAndUpdate(item._id, { queuePosition: index + 1 })
    )
  );
};

const getMyTransactions = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin"
    ? { status: { $in: ["issued", "overdue"] } }
    : { userId: req.user._id };
  const items = await Transaction.find(filter)
    .populate("userId", "name email")
    .populate("bookId", "title author coverImage genre")
    .sort({ createdAt: -1 });

  // Some legacy rows can still come through with a raw userId value.
  // Normalize those rows so frontend always receives member details.
  const missingUserIds = [...new Set(
    items
      .filter((item) => !item.userId || typeof item.userId === "string" || item.userId.name == null)
      .map((item) => String(item.userId?._id || item.userId))
      .filter(Boolean)
  )];

  if (missingUserIds.length > 0) {
    const users = await User.find({ _id: { $in: missingUserIds } }).select("name email").lean();
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    items.forEach((item) => {
      const userKey = String(item.userId?._id || item.userId || "");
      const matchedUser = userMap.get(userKey);
      if (matchedUser) {
        item.userId = matchedUser;
      }
    });
  }

  res.json({ success: true, data: items });
});

const sendReturnEmail = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only admin can send return emails");
  }

  const tx = await Transaction.findById(req.params.id)
    .populate("userId", "name email emailNotificationsOptIn")
    .populate("bookId", "title");

  if (!tx) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  const providedReturnDate = req.body.returnDate;
  if (!providedReturnDate) {
    res.status(400);
    throw new Error("Return date is required");
  }

  const parsedDate = new Date(providedReturnDate);
  if (Number.isNaN(parsedDate.getTime())) {
    res.status(400);
    throw new Error("Invalid return date format");
  }

  if (parsedDate < tx.issueDate) {
    res.status(400);
    throw new Error("Return date cannot be before issue date");
  }

  const fine = calculateFine(tx.dueDate, parsedDate);
  const sent = await sendReturnEstimateEmail({
    user: tx.userId,
    book: tx.bookId,
    returnDate: parsedDate,
    fine,
  });

  if (!sent) {
    res.status(400);
    throw new Error("Email could not be sent. Check recipient opt-in and SMTP settings.");
  }

  res.json({
    success: true,
    message: "Return email sent successfully",
    data: {
      transactionId: tx._id,
      returnDate: parsedDate,
      fine,
      recipient: tx.userId?.email,
    },
  });
});

module.exports = {
  issueBook,
  returnBook,
  getMyTransactions,
  sendReturnEmail,
  calculateFine,
};
