import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./BookDetails.css";

/* 🔥 PRODUCTION BACKEND URL */
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function BookDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================================
     ✅ FETCH BOOK (No ESLint Warning)
  ================================= */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API}/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  /* ================================
     ✅ SUBMIT REVIEW
  ================================= */
  const submitReview = async () => {
    if (!token) {
      toast.error("Please login to add review");
      return;
    }

    if (!comment.trim()) {
      toast.error("Review cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${API}/api/books/${id}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review added successfully 🎉");
      setComment("");

      // Refresh book data
      const res = await axios.get(`${API}/api/books/${id}`);
      setBook(res.data);

    } catch (err) {
      console.error("Submit review error:", err);
      toast.error(
        err.response?.data?.message || "Failed to add review"
      );
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!book) return <p className="loading">Book not found</p>;

  return (
    <div className="book-details-page">
      <Navbar />

      <div className="book-container">
        {/* LEFT SIDE */}
        <div className="book-image-section">
          <img src={book.image} alt={book.title} />
        </div>

        {/* RIGHT SIDE */}
        <div className="book-info-section">
          <h1>{book.title}</h1>
          <p className="author">By {book.author}</p>

          <div className="rating">
            ⭐ {book.avgRating?.toFixed(1) || "0.0"} / 5
          </div>

          <div className="price">₹{book.price}</div>

          <div className="stock">
            {book.stock > 0 ? "In Stock ✅" : "Out of Stock ❌"}
          </div>

          {/* REVIEWS */}
          <div className="review-section">
            <h3>Customer Reviews</h3>

            {!book.reviews || book.reviews.length === 0 ? (
              <p className="no-review">No reviews yet.</p>
            ) : (
              book.reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <strong>{r.name}</strong>
                    <span>⭐ {r.rating}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))
            )}

            {/* ADD REVIEW */}
            <div className="add-review">
              <h4>Add Your Review</h4>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Stars
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}