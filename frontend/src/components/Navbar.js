import { NavLink, useNavigate } from "react-router-dom";
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
      {/* LEFT */}
      <div className="nav-left">
        <NavLink to="/" className="logo">
          📚 <span>BookStore</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        {user && (
          <>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              My Orders
            </NavLink>

            {user.role === "Admin" && (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Admin
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Orders
                </NavLink>

                <NavLink
                  to="/admin/books"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Manage Books
                </NavLink>
              </>
            )}
          </>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <NavLink to="/cart" className="cart-link">
          🛒 Cart
          <span className="cart-badge">{cartCount}</span>
        </NavLink>

        {user ? (
          <>
            <span className="welcome">Hi, {user.name}</span>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}