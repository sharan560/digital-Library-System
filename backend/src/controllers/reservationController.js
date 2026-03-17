const Reservation = require("../models/Reservation");
const Book = require("../models/Book");
const asyncHandler = require("../utils/asyncHandler");

const reserveBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.bookId || req.body.bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.availableCopies > 0) {
    res.status(400);
    throw new Error("Book is available, borrow directly");
  }

  const exists = await Reservation.findOne({
    userId: req.user._id,
    bookId: book._id,
    status: "active",
  });

  if (exists) {
    res.status(409);
    throw new Error("You already have an active reservation for this book");
  }

  const queueCount = await Reservation.countDocuments({
    bookId: book._id,
    status: "active",
  });

  const reservation = await Reservation.create({
    userId: req.user._id,
    bookId: book._id,
    queuePosition: queueCount + 1,
  });

  res.status(201).json({ success: true, data: reservation });
});

const getMyReservations = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { userId: req.user._id };

  const reservations = await Reservation.find(filter)
    .populate("bookId", "title author coverImage availability")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reservations });
});

const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }

  if (req.user.role !== "admin" && String(reservation.userId) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Cannot cancel another user's reservation");
  }

  reservation.status = "cancelled";
  await reservation.save();

  const queue = await Reservation.find({
    bookId: reservation.bookId,
    status: "active",
  }).sort({ queuePosition: 1, createdAt: 1 });

  await Promise.all(
    queue.map((item, index) => Reservation.findByIdAndUpdate(item._id, { queuePosition: index + 1 }))
  );

  res.json({ success: true, message: "Reservation cancelled" });
});

module.exports = { reserveBook, getMyReservations, cancelReservation };
