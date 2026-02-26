import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalSales: 0,
    todayOrders: 0,
    topSelling: [],
    lowStock: [],
  });

  const token = localStorage.getItem("token");

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard analytics");
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="admin-dashboard-page">
      <Navbar />

      <div className="admin-dashboard-container">
        <h2 className="dashboard-title">📊 Admin Dashboard</h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card orders">
            <h4>Total Orders</h4>
            <p>{analytics.totalOrders}</p>
          </div>
          <div className="stat-card sales">
            <h4>Total Sales</h4>
            <p>₹{analytics.totalSales}</p>
          </div>
          <div className="stat-card today">
            <h4>Orders Today</h4>
            <p>{analytics.todayOrders}</p>
          </div>
        </div>

        {/* Top Selling */}
        <h3 className="section-title">🔥 Top Selling Books</h3>
        <div className="top-selling-grid">
          {analytics.topSelling.length === 0 && (
            <p className="muted">No sales yet</p>
          )}
          {analytics.topSelling.map((b) => (
            <div key={b._id} className="top-selling-card">
              <img src={b.image} alt={b.title} />
              <h5>{b.title}</h5>
              <span>Sold: {b.sold}</span>
            </div>
          ))}
        </div>

        {/* Low Stock */}
        <h3 className="section-title">⚠️ Low Stock Alerts</h3>
        <div className="low-stock-grid">
          {analytics.lowStock.length === 0 ? (
            <p className="success-text">All books are well stocked 🎉</p>
          ) : (
            analytics.lowStock.map((b) => (
              <div key={b._id} className="low-stock-card">
                <img src={b.image} alt={b.title} />
                <div>
                  <h5>{b.title}</h5>
                  <span>{b.stock} left</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}