const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 🧪 Test route
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Orders route working" });
});

// 🛒 Place order + reduce stock
router.post("/", auth, async (req, res) => {
  try {
    const { items, address, phone, total } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    if (!address?.line1 || !address?.city || !address?.state || !address?.pincode) {
      return res.status(400).json({ message: "Complete address required" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Validate stock
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

    // Reduce stock
    for (const i of items) {
      await Book.findByIdAndUpdate(i.bookId, { $inc: { stock: -i.qty } });
    }

    const order = await Order.create({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      items,
      address,
      phone,
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
    console.error("Fetch my orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// 🔍 Get single order (Edit page)
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user.id === req.user.id;
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get single order error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// ✏️ Edit delivery details (User or Admin)
router.put("/:id/edit", auth, async (req, res) => {
  try {
    const { address, phone } = req.body;

    if (!address && !phone) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user.id === req.user.id;
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: "Cannot edit after delivery or cancellation",
      });
    }

    if (address) order.address = address;
    if (phone) order.phone = phone;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Edit order error:", err);
    res.status(500).json({ message: "Failed to update delivery details" });
  }
});

// 👑 Admin: get all orders
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Admin fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// 🔁 Admin OR Owner: update status (user can cancel only)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user.id === req.user.id;
    const isAdmin = req.user.role === "Admin";

    // User rules
    if (!isAdmin) {
      if (!isOwner) {
        return res.status(403).json({ message: "Not allowed" });
      }

      if (status !== "Cancelled") {
        return res.status(403).json({ message: "Only admin can change status" });
      }

      if (!["Pending", "Shipped"].includes(order.status)) {
        return res.status(400).json({ message: "Cannot cancel at this stage" });
      }
    }

    // Restore stock once
    if (status === "Cancelled" && order.status !== "Cancelled") {
      for (const i of order.items) {
        await Book.findByIdAndUpdate(i.bookId, { $inc: { stock: i.qty } });
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

module.exports = router;