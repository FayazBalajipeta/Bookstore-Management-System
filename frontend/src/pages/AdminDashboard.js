import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    image: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 📚 Fetch books
        const booksRes = await axios.get("http://localhost:5000/api/books");
        setBooks(booksRes.data);

        // 📊 Fetch analytics
        const analyticsRes = await axios.get("http://localhost:5000/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(analyticsRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      }
    };

    fetchAll();
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/books/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Book updated");
      } else {
        await axios.post("http://localhost:5000/api/books", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Book added");
      }

      setForm({
        title: "",
        author: "",
        price: "",
        genre: "",
        image: "",
        stock: "",
      });
      setEditingId(null);

      // Refresh data
      const booksRes = await axios.get("http://localhost:5000/api/books");
      setBooks(booksRes.data);

      const analyticsRes = await axios.get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(analyticsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const edit = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title,
      author: b.author,
      price: b.price,
      genre: b.genre,
      image: b.image,
      stock: b.stock,
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");

      // Refresh data
      const booksRes = await axios.get("http://localhost:5000/api/books");
      setBooks(booksRes.data);

      const analyticsRes = await axios.get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(analyticsRes.data);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h2>📊 Admin Dashboard</h2>

        {/* ====== ANALYTICS ====== */}
        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{stats.totalOrders}</p>
              </div>

              <div className="stat-card">
                <h3>Total Sales</h3>
                <p>₹{stats.totalSales}</p>
              </div>

              <div className="stat-card">
                <h3>Orders Today</h3>
                <p>{stats.ordersToday}</p>
              </div>
            </div>

            <h3>🔥 Top Selling Books</h3>
            <div className="top-books">
              {stats.topBooks.map((b) => (
                <div key={b._id} className="top-book-card">
                  <img src={b.image} alt={b.title} />
                  <p>{b.title}</p>
                  <span>Sold: {b.sold}</span>
                </div>
              ))}
            </div>

            <h3>⚠️ Low Stock Alerts</h3>
            <div className="low-stock">
              {stats.lowStockBooks.length === 0 && <p>All good 🎉</p>}
              {stats.lowStockBooks.map((b) => (
                <div key={b._id} className="low-stock-card">
                  <img src={b.image} alt={b.title} />
                  <p>{b.title}</p>
                  <span>Stock: {b.stock}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ====== BOOK CRUD ====== */}
        <h2>📚 Manage Books</h2>

        <form className="admin-form" onSubmit={submit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Genre"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button>{editingId ? "Update Book" : "Add Book"}</button>
        </form>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>₹{b.price}</td>
                <td>{b.stock}</td>
                <td>
                  <button onClick={() => edit(b)}>Edit</button>
                  <button className="danger" onClick={() => remove(b._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}