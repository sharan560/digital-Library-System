const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    fine: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue"],
      default: "issued",
    },
    isFinePaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, status: 1 });
transactionSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
