import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./AdminBooks.css";

// ✅ Production Backend URL
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "Fantasy",
    image: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const genres = [
    "Fantasy",
    "Sci-Fi",
    "Fiction",
    "Romance",
    "Mystery",
    "Non-Fiction",
  ];

  // ✅ Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/books`);
      setBooks(res.data);
    } catch (err) {
      toast.error("Failed to load books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ✅ Add / Update Book
  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API}/api/books/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Book updated successfully");
      } else {
        await axios.post(
          `${API}/api/books`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Book added successfully");
      }

      setForm({
        title: "",
        author: "",
        price: "",
        genre: "Fantasy",
        image: "",
        stock: "",
      });

      setEditingId(null);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  // ✅ Edit Book
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

  // ✅ Delete Book
  const remove = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await axios.delete(`${API}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="admin-books-container">
        <h2>📚 Manage Books</h2>

        <form className="admin-books-form" onSubmit={submit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            placeholder="Author"
            value={form.author}
            onChange={(e) =>
              setForm({ ...form, author: e.target.value })
            }
          />

          <input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          {/* Genre Dropdown */}
          <select
            value={form.genre}
            onChange={(e) =>
              setForm({ ...form, genre: e.target.value })
            }
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <button>
            {editingId ? "Update Book" : "Add Book"}
          </button>
        </form>

        <table className="admin-books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Genre</th>
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
                <td>{b.genre}</td>
                <td>{b.stock}</td>
                <td>
                  <button onClick={() => edit(b)}>
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() => remove(b._id)}
                  >
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