import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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

  const editDetails = async (orderId) => {
    const newPhone = prompt("Enter new phone number:");
    const newLine1 = prompt("Enter new address line:");
    const newCity = prompt("Enter new city:");
    const newState = prompt("Enter new state:");
    const newPincode = prompt("Enter new pincode:");

    if (!newPhone && !newLine1 && !newCity && !newState && !newPincode) {
      toast.info("Nothing to update");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/edit`,
        {
          phone: newPhone,
          address: {
            line1: newLine1,
            city: newCity,
            state: newState,
            pincode: newPincode,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Delivery details updated");
      fetchMyOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="orders-page">
      <Navbar />
      <div className="orders-container">
        <h2>📦 My Orders</h2>

        {orders.length === 0 && <p className="empty">No orders yet.</p>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
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

            <div className="order-footer">
              <div className="total">Total: ₹{o.total}</div>

              {["Pending", "Shipped"].includes(o.status) && (
                <button
                  className="edit-btn"
                  onClick={() => editDetails(o._id)}
                >
                  ✏️ Edit Delivery Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}