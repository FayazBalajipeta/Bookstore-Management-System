import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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
      toast.error("Failed to load your orders");
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div>
      <Navbar />
      <div className="my-orders">
        <h2>My Orders</h2>

        {orders.length === 0 && <p>No orders yet.</p>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-header">
              <div>
                <strong>Order ID:</strong> {o._id}
                <br />
                <strong>Date:</strong>{" "}
                {new Date(o.createdAt).toLocaleString()}
              </div>

              <span className={`status ${o.status.toLowerCase()}`}>
                {o.status}
              </span>
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

            <div className="total">Total: ₹{o.total}</div>

            {/* ✏️ EDIT BUTTON → Redirect to Edit Page */}
            {["Pending", "Shipped"].includes(o.status) && (
              <button
                className="edit-btn"
                onClick={() => navigate(`/orders/${o._id}/edit`)}
              >
                ✏️ Edit Delivery Details
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}