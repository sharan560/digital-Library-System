const express = require("express");
const {
  issueBook,
  returnBook,
  getMyTransactions,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMyTransactions);
router.post("/issue", issueBook);
router.put("/:id/return", returnBook);

module.exports = router;
