import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId;

  return (
    <div>
      <Navbar />
      <div className="success-container">
        <div className="success-card">
          <h2>🎉 Order Placed Successfully!</h2>

          {orderId && (
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
          )}

          <p>Thank you for your purchase. Your order is being processed.</p>

          <div className="success-actions">
            <button onClick={() => navigate("/orders")}>View My Orders</button>
            <Link to="/">Go to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}