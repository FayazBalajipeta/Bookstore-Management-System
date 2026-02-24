import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import "./Checkout.css"; // reuse styles

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (["Delivered", "Cancelled"].includes(res.data.status)) {
          toast.error("This order can no longer be edited");
          navigate("/orders");
          return;
        }

        setAddress(res.data.address);
        setPhone(res.data.phone);
        setLoading(false);
      } catch {
        toast.error("Failed to load order");
        navigate("/orders");
      }
    };

    fetchOrder();
  }, [id, token, navigate]);

  const updateOrder = async () => {
    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all address fields");
      return;
    }

    if (!phone || phone.length < 10) {
      toast.error("Enter valid phone number");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}/edit`,
        { address, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Delivery details updated");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <h2>Edit Delivery Details</h2>

        <div className="checkout-grid">
          <div className="address-box">
            <h3>Shipping Address</h3>

            <input
              placeholder="Address Line"
              value={address.line1}
              onChange={(e) =>
                setAddress({ ...address, line1: e.target.value })
              }
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

            <button onClick={updateOrder} className="place-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}