const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 🧪 Test route (debug)
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Orders route working" });
});

// 🛒 Place order (login required)
router.post("/", auth, async (req, res) => {
  try {
    const { items, address, total } = req.body;

    if (!items?.length || !address || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

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

// 👤 User: get my orders (login required)
router.get("/my/:userId", auth, async (req, res) => {
  try {
    // Ensure user can only access their own orders
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

// 👑 Admin: get all orders
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
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
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;