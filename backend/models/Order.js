const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      id: String,
      name: String,
      email: String,
    },
    items: [
      {
        bookId: String,
        title: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    phone: {
      type: String,
      required: true, // ✅ phone number required for delivery
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"], // ✅ restrict values
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);