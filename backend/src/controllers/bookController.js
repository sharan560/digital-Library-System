const { validationResult } = require("express-validator");
const Book = require("../models/Book");
const asyncHandler = require("../utils/asyncHandler");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBookFilter = ({ q, genre, author, availability }) => {
  const filter = {};
  const trimmedQuery = q?.trim();

  if (trimmedQuery) {
    const safeQuery = escapeRegex(trimmedQuery);
    filter.$or = [
      { title: { $regex: safeQuery, $options: "i" } },
      { author: { $regex: safeQuery, $options: "i" } },
      { genre: { $regex: safeQuery, $options: "i" } },
      { description: { $regex: safeQuery, $options: "i" } },
      { isbn: { $regex: safeQuery, $options: "i" } },
    ];
  }

  if (genre) {
    filter.genre = { $regex: `^${escapeRegex(genre)}$`, $options: "i" };
  }

  if (author) {
    filter.author = { $regex: escapeRegex(author), $options: "i" };
  }

  if (availability === "true") {
    filter.availability = true;
  } else if (availability === "false") {
    filter.availability = false;
  }

  return filter;
};

const getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);
  const skip = (page - 1) * limit;

  const { q, genre, author, availability, sort = "latest" } = req.query;
  const filter = buildBookFilter({ q, genre, author, availability });

  const sortMap = {
    popularity: { borrowCount: -1 },
    latest: { createdAt: -1 },
    alphabetical: { title: 1 },
  };

  const query = Book.find(filter)
    .sort(sortMap[sort] || sortMap.latest)
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

const getBookSearchMeta = asyncHandler(async (req, res) => {
  const q = req.query.q?.trim() || "";
  const safeQuery = q ? escapeRegex(q) : null;

  const [genres, authors, suggestions] = await Promise.all([
    Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 },
    ]),
    Book.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 },
    ]),
    q
      ? Book.find({
          $or: [
            { title: { $regex: safeQuery, $options: "i" } },
            { author: { $regex: safeQuery, $options: "i" } },
            { genre: { $regex: safeQuery, $options: "i" } },
          ],
        })
          .select("title author genre availability")
          .sort({ borrowCount: -1, createdAt: -1 })
          .limit(6)
      : Promise.resolve([]),
  ]);

  res.json({
    success: true,
    data: {
      genres: genres.map((item) => item._id).filter(Boolean),
      authors: authors.map((item) => item._id).filter(Boolean),
      suggestions,
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
  getBookSearchMeta,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
