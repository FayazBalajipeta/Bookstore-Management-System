import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditOrder.css";

// ✅ Production Backend URL
const API = "https://bookstore-management-system-6qhx.onrender.com";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [phone, setPhone] = useState("");

  // ✅ Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${API}/api/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrder(res.data);
        setAddress(res.data.address);
        setPhone(res.data.phone || "");
      } catch (err) {
        toast.error("Failed to load order");
      }
    };

    fetchOrder();
  }, [id, token]);

  // ✅ Update Delivery Details
  const updateDetails = async () => {
    try {
      await axios.put(
        `${API}/api/orders/${id}/edit`,
        { address, phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Delivery details updated");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // ✅ Cancel Order
  const cancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await axios.put(
        `${API}/api/orders/${id}/status`,
        { status: "Cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order cancelled successfully");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  if (!order)
    return <p style={{ padding: "40px" }}>Loading...</p>;

  return (
    <div className="edit-page">
      <Navbar />

      <div className="edit-container">
        <h2 className="edit-title">✏️ Edit Delivery Details</h2>

        <div className="edit-grid">
          {/* LEFT */}
          <div className="edit-card">
            <h3>Shipping Address</h3>

            <div className="form-grid">
              <input
                value={address.line1}
                onChange={(e) =>
                  setAddress({ ...address, line1: e.target.value })
                }
                placeholder="Address Line"
              />

              <input
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                placeholder="City"
              />

              <input
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                placeholder="State"
              />

              <input
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                placeholder="Pincode"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>

            <button className="btn-primary" onClick={updateDetails}>
              Update Delivery Details
            </button>

            {["Pending", "Shipped"].includes(order.status) && (
              <button className="btn-danger" onClick={cancelOrder}>
                ❌ Cancel Order
              </button>
            )}
          </div>

          {/* RIGHT */}
          <div className="edit-card">
            <h3>Order Summary</h3>

            {order.items.map((i) => (
              <div key={i.bookId} className="summary-row">
                <span>
                  {i.title} × {i.qty}
                </span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <div className="summary-total">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>

            <span
              className={`status-badge ${order.status.toLowerCase()}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}