const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes"); // ✅ MUST match file name exactly
const analyticsRoutes = require("./routes/analyticsRoutes"); 
const app = express();
app.use(cors());
app.use(express.json());

console.log("👉 Mounting routes...");

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes); // ✅ THIS is the route your frontend calls
app.use("/api/analytics", analyticsRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));