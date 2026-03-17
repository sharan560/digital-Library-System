const express = require("express");
const {
  issueBook,
  returnBook,
  getMyTransactions,
  sendReturnEmail,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMyTransactions);
router.post("/issue", issueBook);
router.post("/:id/send-return-email", sendReturnEmail);
router.put("/:id/return", returnBook);

module.exports = router;
