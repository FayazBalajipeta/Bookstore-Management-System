import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// ✅ Production Backend URL
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ✅ Fetch Books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API}/api/books`);
        setBooks(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  const genres = ["All", ...new Set(books.map((b) => b.genre))];

  // ✅ Filters Logic
  useEffect(() => {
    let result = books;

    if (activeGenre !== "All") {
      result = result.filter((b) => b.genre === activeGenre);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    if (minPrice !== "") {
      result = result.filter((b) => b.price >= Number(minPrice));
    }

    if (maxPrice !== "") {
      result = result.filter((b) => b.price <= Number(maxPrice));
    }

    setFiltered(result);
  }, [activeGenre, search, minPrice, maxPrice, books]);

  const clearAll = () => {
    setActiveGenre("All");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div>
      <Navbar />

      <div className="home-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categories</h3>

          <ul>
            {genres.map((g) => (
              <li
                key={g}
                className={activeGenre === g ? "active" : ""}
                onClick={() => setActiveGenre(g)}
              >
                {g}
              </li>
            ))}
          </ul>

          {(activeGenre !== "All" || search || minPrice || maxPrice) && (
            <button onClick={clearAll} className="clear-btn">
              Clear Filters
            </button>
          )}
        </aside>

        {/* Books Section */}
        <main className="home-container">
          {/* Top Filters */}
          <div className="top-filters">
            <input
              className="top-search"
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="top-price">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <h2>Browse Books</h2>

          {filtered.length === 0 && <p>No books found 😕</p>}

          <div className="book-grid">
            {filtered.map((b) => (
              <div key={b._id} className="book-card">
                <img
                  src={b.image}
                  alt={b.title}
                  onClick={() => navigate(`/books/${b._id}`)}
                />

                <h4 onClick={() => navigate(`/books/${b._id}`)}>
                  {b.title}
                </h4>

                <p className="author">{b.author}</p>
                <span className="genre">{b.genre}</span>

                <p>
                  ⭐ {b.avgRating ? b.avgRating.toFixed(1) : "0.0"} / 5
                </p>

                <p className="price">₹{b.price}</p>

                <button onClick={() => addToCart(b)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}