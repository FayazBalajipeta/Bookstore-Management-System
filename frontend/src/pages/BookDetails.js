import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

// ✅ Production Backend URL
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function BookDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // ✅ Fetch Book Details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API}/api/books/${id}`);
        setBook(res.data);
      } catch {
        toast.error("Failed to load book");
      }
    };

    fetchBook();
  }, [id]);

  // ✅ Submit Review
  const submitReview = async () => {
    if (!token) {
      toast.error("Login to add review");
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

      toast.success("Review added successfully");
      setComment("");

      // Refresh book data
      const res = await axios.get(`${API}/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />

      <div style={{ padding: 20 }}>
        <h2>{book.title}</h2>
        <p>By {book.author}</p>
        <p>⭐ {book.avgRating?.toFixed(1) || "0.0"} / 5</p>

        <h3>Reviews</h3>

        {book.reviews.length === 0 && <p>No reviews yet.</p>}

        {book.reviews.map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <strong>{r.name}</strong> ⭐ {r.rating}
            <p>{r.comment}</p>
          </div>
        ))}

        <h3>Add Review</h3>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <br />
        <br />

        <textarea
          placeholder="Write a review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{ width: "100%", maxWidth: 400 }}
        />

        <br />
        <br />

        <button onClick={submitReview}>
          Submit Review
        </button>
      </div>
    </div>
  );
}