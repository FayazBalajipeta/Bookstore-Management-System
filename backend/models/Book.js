const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    genre: String,
    price: Number,
    stock: Number,
    image: String,

    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);