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

/* =====================================
   ✅ PRODUCTION-SAFE CORS CONFIG
===================================== */

const allowedOrigins = [
  "http://localhost:3000",
  "https://bookstoreapp-tawny.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(null, false); // do NOT throw error
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* =====================================
   ✅ HEALTH CHECK ROUTE
===================================== */

app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

/* =====================================
   ✅ API ROUTES
===================================== */

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

/* =====================================
   ✅ GLOBAL ERROR HANDLER
===================================== */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* =====================================
   ✅ DATABASE CONNECTION
===================================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

/* =====================================
   ✅ PORT CONFIG (Render Required)
===================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});