const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book");

// ✅ Correct middleware imports (based on your folder)
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 📊 Admin Analytics
router.get("/analytics", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    const today = new Date().toDateString();
    const todayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    ).length;

    // 🔥 Top selling
    const salesMap = {};
    orders.forEach((o) => {
      o.items.forEach((i) => {
        salesMap[i.bookId] = (salesMap[i.bookId] || 0) + i.qty;
      });
    });

    const books = await Book.find();
    const topSelling = books
      .map((b) => ({
        _id: b._id,
        title: b.title,
        image: b.image,
        sold: salesMap[b._id] || 0,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // ⚠️ Low stock alerts
    const lowStock = books.filter((b) => b.stock <= 5);

    res.json({ totalOrders, totalSales, todayOrders, topSelling, lowStock });
  } catch (err) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
});

module.exports = router;