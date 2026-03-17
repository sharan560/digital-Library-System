const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    totalCopies: { type: Number, default: 1, min: 1 },
    availableCopies: { type: Number, default: 1, min: 0 },
    availability: { type: Boolean, default: true },
    coverImage: { type: String, default: "" },
    borrowCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", genre: "text", description: "text" });

module.exports = mongoose.model("Book", bookSchema);
