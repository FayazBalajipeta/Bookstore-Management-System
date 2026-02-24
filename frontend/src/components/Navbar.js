import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        📚 BookStore
      </Link>

      <div className="nav-links">
        <Link to="/cart">🛒 Cart ({cartCount})</Link>

        {/* 👑 Admin links */}
        {user?.role === "Admin" && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/orders">Orders</Link>
          </>
        )}

       {user ? (
  <>
   <Link to="/orders">My Orders</Link>
    <span className="welcome">Hi, {user.name}</span>
    <button onClick={logout}>Logout</button>
  </>
) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}