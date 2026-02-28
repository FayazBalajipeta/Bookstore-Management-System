const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const adminRoutes = require("./routes/AdminRoutes");

const app = express();

/* ================================
   ✅ PRODUCTION-READY CORS SETUP
================================ */

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL, // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* ================================
   ✅ HEALTH CHECK ROUTE
================================ */

app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

/* ================================
   ✅ API ROUTES
================================ */

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

/* ================================
   ✅ GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================================
   ✅ DATABASE CONNECTION
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* ================================
   ✅ PORT CONFIG (IMPORTANT)
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);