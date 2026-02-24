import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import "./Cart.css";
import { Link } from "react-router-dom";
export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <Navbar />

      <div className="cart-container">
        <h2>Your Cart</h2>

        {cart.length === 0 && <p>Your cart is empty.</p>}

        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <img src={item.image} alt={item.title} />
            <div>
              <h4>{item.title}</h4>
              <p>₹{item.price} × {item.qty}</p>
            </div>
            <button onClick={() => removeFromCart(item._id)}>Remove</button>
          </div>
        ))}

        {cart.length > 0 && (
          <div className="cart-footer">
            <h3>Total: ₹{total}</h3>
            <button className="clear" onClick={clearCart}>Clear Cart</button>
            <Link to="/checkout" className="checkout">Checkout</Link>
          </div>
        )}
      </div>
    </div>
  );
}