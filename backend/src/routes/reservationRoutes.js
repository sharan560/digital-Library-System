const express = require("express");
const {
  reserveBook,
  getMyReservations,
  cancelReservation,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMyReservations);
router.post("/:bookId", reserveBook);
router.delete("/:id", cancelReservation);

module.exports = router;
