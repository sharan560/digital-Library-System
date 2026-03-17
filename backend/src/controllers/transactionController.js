const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Reservation = require("../models/Reservation");
const asyncHandler = require("../utils/asyncHandler");

const DAILY_FINE = Number(process.env.DAILY_FINE || 10);
const BORROW_DAYS = Number(process.env.BORROW_DAYS || 14);

const calculateFine = (dueDate) => {
  const now = new Date();
  if (now <= dueDate) return 0;
  const lateDays = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
  return lateDays * DAILY_FINE;
};

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

  res.status(201).json({ success: true, data: tx });
});

const returnBook = asyncHandler(async (req, res) => {
  const tx = await Transaction.findById(req.params.id);

  if (!tx) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  if (tx.status === "returned") {
    res.status(400);
    throw new Error("Book already returned");
  }

  if (req.user.role !== "admin" && String(tx.userId) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Cannot return transaction for another user");
  }

  tx.returnDate = new Date();
  tx.fine = calculateFine(tx.dueDate);
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

  res.json({ success: true, data: tx });
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
  const filter = req.user.role === "admin" ? {} : { userId: req.user._id };
  const items = await Transaction.find(filter)
    .populate("bookId", "title author coverImage genre")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: items });
});

module.exports = {
  issueBook,
  returnBook,
  getMyTransactions,
  calculateFine,
};
