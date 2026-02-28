const router = require("express").Router();
const mongoose = require("mongoose");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ======================================
   📚 Get all books (Public)
====================================== */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

/* ======================================
   📘 Get single book (Public)
====================================== */
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

/* ======================================
   ⭐ Add Review (Logged-in Users)
====================================== */
router.post("/:id/reviews", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = book.reviews.find(
      (r) => r.user?.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this book",
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user.id,
    };

    book.reviews.push(review);

    // Recalculate average rating
    book.avgRating =
      book.reviews.reduce((acc, item) => acc + item.rating, 0) /
      book.reviews.length;

    await book.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error("Review error:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
});

/* ======================================
   ➕ Add book (Admin only)
====================================== */
router.post("/", auth, admin, async (req, res) => {
  try {
    const { title, author, price, genre, image, stock } = req.body;

    if (!title || !author || !price || !genre || !image || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const book = await Book.create({
      title,
      author,
      price,
      genre,
      image,
      stock,
      reviews: [],
      avgRating: 0,
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ message: "Failed to add book" });
  }
});

/* ======================================
   ✏️ Update book (Admin only)
====================================== */
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update book" });
  }
});

/* ======================================
   ❌ Delete book (Admin only)
====================================== */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

module.exports = router;