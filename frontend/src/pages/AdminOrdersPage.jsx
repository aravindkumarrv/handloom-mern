// frontend/src/pages/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔐 PROTECT PAGE (ADMIN ONLY)
  useEffect(() => {
    const raw = localStorage.getItem("handloomUser");

    if (!raw) {
      navigate("/admin-login");
      return;
    }

    const user = JSON.parse(raw);

    if (user.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    loadOrders();
  }, [navigate]);

  // 📦 Load Orders
  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚚 Mark Shipped
  const markShipped = async (id) => {
    try {
      await api.patch(`/orders/${id}/status`);
      loadOrders();
    } catch (err) {
      alert("Failed to update order.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Customer Orders</h2>
            <p>
              View and manage all orders placed by customers.
            </p>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="feature-grid">
              {orders.map((order) => (
                <div key={order._id} className="feature-card">
                  <h3>{order.product?.name}</h3>

                  <p><b>Customer:</b> {order.customerName}</p>
                  <p><b>Phone:</b> {order.phone}</p>
                  <p><b>Address:</b> {order.address}</p>
                  <p><b>Quantity:</b> {order.quantity}</p>
                  <p><b>Total:</b> ₹{order.totalPrice}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      style={{
                        color:
                          order.status === "Shipped"
                            ? "green"
                            : "#b83232",
                        fontWeight: 600,
                      }}
                    >
                      {order.status}
                    </span>
                  </p>

                  {order.status === "Pending" && (
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "0.5rem" }}
                      onClick={() => markShipped(order._id)}
                    >
                      Mark as Shipped
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminOrdersPage;
