import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty 😕</h3>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((i) => (
                <div key={i._id} className="cart-item">
                  <img src={i.image} alt={i.title} />

                  <div className="cart-info">
                    <h4>{i.title}</h4>
                    <p>₹{i.price} × {i.qty}</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(i._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Total: ₹{total}</h3>

              <div className="cart-actions">
                <button className="clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <button
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}