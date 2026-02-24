const router = require("express").Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all books (public)
router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";
    const books = await Book.find({
      title: { $regex: q, $options: "i" },
    }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add book (Admin)
router.post("/", auth, admin, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update book (Admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete book (Admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;