const express = require("express");
const { body } = require("express-validator");
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("coverImage"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
    body("isbn").notEmpty().withMessage("ISBN is required"),
  ],
  createBook
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("coverImage"),
  updateBook
);

router.delete("/:id", protect, authorize("admin"), deleteBook);

module.exports = router;
