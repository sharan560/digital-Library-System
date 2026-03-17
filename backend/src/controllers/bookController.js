const { validationResult } = require("express-validator");
const Book = require("../models/Book");
const asyncHandler = require("../utils/asyncHandler");

const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);
  const skip = (page - 1) * limit;

  const { q, genre, author, availability, sort = "latest" } = req.query;
  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (genre) {
    filter.genre = genre;
  }

  if (author) {
    filter.author = { $regex: author, $options: "i" };
  }

  if (availability !== undefined) {
    filter.availability = availability === "true";
  }

  const sortMap = {
    popularity: { borrowCount: -1 },
    latest: { createdAt: -1 },
    alphabetical: { title: 1 },
  };

  const projection = q ? { score: { $meta: "textScore" } } : {};
  const query = Book.find(filter, projection)
    .sort(q ? { score: { $meta: "textScore" } } : sortMap[sort] || sortMap.latest)
    .skip(skip)
    .limit(limit);

  const [books, total] = await Promise.all([query, Book.countDocuments(filter)]);

  res.json({
    success: true,
    data: books,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json({ success: true, data: book });
});

const createBook = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const payload = req.body;
  const totalCopies = Number(payload.totalCopies || 1);
  const availableCopies = Number(payload.availableCopies || totalCopies);

  const book = await Book.create({
    ...payload,
    totalCopies,
    availableCopies,
    availability: availableCopies > 0,
    coverImage: req.file ? `/uploads/${req.file.filename}` : payload.coverImage || "",
  });

  res.status(201).json({ success: true, data: book });
});

const updateBook = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (payload.totalCopies !== undefined) payload.totalCopies = Number(payload.totalCopies);
  if (payload.availableCopies !== undefined)
    payload.availableCopies = Number(payload.availableCopies);

  if (req.file) {
    payload.coverImage = `/uploads/${req.file.filename}`;
  }

  if (payload.availableCopies !== undefined) {
    payload.availability = payload.availableCopies > 0;
  }

  const book = await Book.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json({ success: true, data: book });
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  res.json({ success: true, message: "Book deleted" });
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
