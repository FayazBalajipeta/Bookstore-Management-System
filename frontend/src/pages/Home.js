import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Home.css";
import { useCart } from "../context/CartContext";
export default function Home() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const { addToCart } = useCart();
  const fetchBooks = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books?q=${q}`);
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  }, [q]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-content">
        <h1>Explore Books 📖</h1>

        <input
          className="search"
          placeholder="Search books..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="book-grid">
          {books.map((b) => (
            <div className="book-card" key={b._id}>
              <img src={b.image} alt={b.title} />
              <h3>{b.title}</h3>
              <p>{b.author}</p>
              <p>₹{b.price}</p>
               <button onClick={() => addToCart(b)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}