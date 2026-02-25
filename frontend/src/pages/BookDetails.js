import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function BookDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch {
        toast.error("Failed to load book");
      }
    };

    fetchBook();
  }, [id]);

  const submitReview = async () => {
    if (!token) {
      toast.error("Login to add review");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/books/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Review added");
      setComment("");
      
      // Refresh book data after review
      const res = await axios.get(`http://localhost:5000/api/books/${id}`);
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
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write a review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={submitReview}>Submit Review</button>
      </div>
    </div>
  );
}