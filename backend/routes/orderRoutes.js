const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book"); // ✅ import Book model
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 🧪 Test route
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Orders route working" });
});

// 🛒 Place order + reduce stock
router.post("/", auth, async (req, res) => {
  try {
    const { items, address, total } = req.body;

    if (!items?.length || !address || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // 1️⃣ Check stock for each book
    for (const i of items) {
      const book = await Book.findById(i.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${i.title}` });
      }
      if (book.stock < i.qty) {
        return res.status(400).json({
          message: `Only ${book.stock} left for "${book.title}"`,
        });
      }
    }

    // 2️⃣ Reduce stock
    for (const i of items) {
      await Book.findByIdAndUpdate(i.bookId, {
        $inc: { stock: -i.qty },
      });
    }

    // 3️⃣ Save order
    const order = await Order.create({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      items,
      address,
      total,
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// 👤 User: get my orders
router.get("/my/:userId", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ "user.id": req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// 👑 Admin: get all orders
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// 👑 Admin: update order status
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;