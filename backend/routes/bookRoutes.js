const router = require("express").Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 📚 Get all books (Public)
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// 📘 Get single book (Public)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

// ➕ Add book (Admin only)
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
    });

    res.status(201).json(book);
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ message: "Failed to add book" });
  }
});

// ✏️ Update book (Admin only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update book" });
  }
});

// ❌ Delete book (Admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete book" });
  }
});

module.exports = router;