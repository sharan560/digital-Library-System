const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    queuePosition: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "fulfilled", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

reservationSchema.index({ bookId: 1, status: 1, queuePosition: 1 });
reservationSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
