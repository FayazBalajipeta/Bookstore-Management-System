import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.info("Please login to continue");
    return <Navigate to="/login" replace />;
  }

  return children;
}