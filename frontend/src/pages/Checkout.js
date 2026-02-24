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
    if (!token) {
      toast.error("Please login to place order");
      return;
    }

    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }

    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all address fields");
      return;
    }

    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart.map((i) => ({
            bookId: i._id,
            title: i.title,
            price: i.price,
            qty: i.qty,
            image: i.image,
          })),
          address: {
            line1: address.line1,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
          phone,
          total: Number(total),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully 🎉");
      clearCart();

      // ✅ Redirect to success page with order id
      navigate("/success", { state: { orderId: res.data._id } });
    } catch (err) {
      console.error("Place order error:", err);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <h2>Checkout</h2>

        <div className="checkout-grid">
          <div className="address-box">
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

          <div className="summary-box">
            <h3>Order Summary</h3>

            {cart.map((i) => (
              <div key={i._id} className="summary-item">
                <span>
                  {i.title} × {i.qty}
                </span>
                <span>₹{i.price * i.qty}</span>
              </div>
            ))}

            <hr />
            <h4>Total: ₹{total}</h4>

            <button onClick={placeOrder} className="place-btn">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}