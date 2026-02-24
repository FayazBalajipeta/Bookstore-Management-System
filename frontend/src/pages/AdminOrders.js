import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Load orders error:", err);
      toast.error(
        err.response?.data?.message || "Failed to load orders"
      );
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-orders">
        <h2>Manage Orders</h2>

        {orders.length === 0 && <p>No orders found.</p>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-header">
              <div>
                <strong>Order ID:</strong> {o._id}
                <br />
                <strong>User:</strong> {o.user?.name} ({o.user?.email})
                <br />
                <strong>Total:</strong> ₹{o.total}
              </div>

              <select
                value={o.status}
                onChange={(e) => updateStatus(o._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="items">
              {o.items.map((i) => (
                <div key={i.bookId} className="item">
                  <img src={i.image} alt={i.title} />
                  <span>
                    {i.title} × {i.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}