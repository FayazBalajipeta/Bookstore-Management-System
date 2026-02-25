const router = require("express").Router();
const Order = require("../models/Order");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// 📊 Admin Analytics
router.get("/", auth, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const totalSalesAgg = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const topBooksAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.bookId",
          title: { $first: "$items.title" },
          sold: { $sum: "$items.qty" },
          image: { $first: "$items.image" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    const lowStockBooks = await Book.find({ stock: { $lte: 5 } }).select(
      "title stock image"
    );

    res.json({
      totalOrders,
      totalSales,
      ordersToday,
      topBooks: topBooksAgg,
      lowStockBooks,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});

module.exports = router;