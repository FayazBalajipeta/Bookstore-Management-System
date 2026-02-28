import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";   // ✅ added
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();                 // ✅ added

  const fetchMyOrders = useCallback(async () => {
    try {
      if (!user?.id) {
        toast.error("User not found. Please login again.");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/orders/my/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Failed to load your orders");
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="orders-page">
      <Navbar />

      <div className="orders-container">
        <h2>📦 My Orders</h2>

        {orders.length === 0 && <p className="empty">No orders yet.</p>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            {/* Header */}
            <div className="order-header">
              <div>
                <div className="order-id">Order ID: {o._id}</div>
                <div className="order-date">
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>

              <span className={`status-badge ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
            </div>

            {/* Items */}
            <div className="order-items">
              {o.items.map((i) => (
                <div key={i.bookId} className="order-item">
                  <img src={i.image} alt={i.title} />
                  <div>
                    <div className="item-title">{i.title}</div>
                    <div className="item-qty">Qty: {i.qty}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="order-footer">
              <div className="total">Total: ₹{o.total}</div>

              {["Pending", "Shipped"].includes(o.status) && (
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/orders/${o._id}/edit`)}
                >
                  ✏️ Edit Order Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}