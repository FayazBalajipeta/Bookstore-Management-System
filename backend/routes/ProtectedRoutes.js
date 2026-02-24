const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Place order (logged-in users - optional: add auth later)
router.post("/", async (req, res) => {
  try {
    const { user, items, address, total } = req.body;
    if (!user || !items?.length || !address || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const order = await Order.create({ user, items, address, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders for a user
router.get("/my/:userId", auth, async (req, res) => {
  try {
    const orders = await Order.find({ "user.id": req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👑 Admin: get all orders
router.get("/", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👑 Admin: update order status
router.put("/:id/status", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;