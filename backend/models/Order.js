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
    total: Number,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);