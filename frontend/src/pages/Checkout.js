import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [phone, setPhone] = useState("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (!token) return toast.error("Please login");

    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.map((i) => ({
            bookId: i._id,
            title: i.title,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          address,
          phone,
          total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully 🎉");
      clearCart();
      navigate("/success");
    } catch (err) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        <h2 className="checkout-title">🧾 Checkout</h2>

        <div className="checkout-grid">
          {/* Address */}
          <div className="checkout-card">
            <h3>Shipping Address</h3>

            <input
              placeholder="Address Line"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            />
            <input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              placeholder="State"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
            <input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Summary */}
          <div className="checkout-card summary-card">
            <h3>Order Summary</h3>

            {cart.map((i) => (
              <div key={i._id} className="summary-row">
                <span>{i.title} × {i.qty}</span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <div className="summary-total">
              <strong>Total</strong>
              <strong>₹{total}</strong>
            </div>

            <button className="place-btn" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}