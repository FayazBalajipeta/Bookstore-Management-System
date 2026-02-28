import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./AdminOrders.css";

// ✅ Production Backend URL
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Load orders error:", err);
      toast.error(err.response?.data?.message || "Failed to load orders");
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Status updated successfully");
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="admin-orders-page">
      <Navbar />

      <div className="admin-orders-container">
        <h2>📦 Manage Orders</h2>

        {orders.length === 0 && (
          <p className="empty-state">No orders found.</p>
        )}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <p>
                  <strong>Order ID:</strong> {o._id}
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {o.user?.name || "User"} ({o.user?.email || "N/A"})
                </p>
                <p>
                  <strong>Total:</strong> ₹{o.total}
                </p>
              </div>

              <select
                className={`status-dropdown ${o.status}`}
                value={o.status}
                onChange={(e) =>
                  updateStatus(o._id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="order-items">
              {o.items.map((i) => (
                <div key={i.bookId} className="order-item">
                  <img src={i.image} alt={i.title} />
                  <div>
                    <p>{i.title}</p>
                    <small>Qty: {i.qty}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}