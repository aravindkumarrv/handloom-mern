import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";

const AdminPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ================= ADMIN PROTECTION =================
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

    fetchOrders();
  }, [navigate]);

  // ================= LOAD ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // ================= FORM HANDLERS =================
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  // ================= ADD PRODUCT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("description", form.description.trim());
      fd.append("stock", form.stock || "0");
      if (imageFile) fd.append("image", imageFile);

      await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Product added successfully!" });

      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "",
      });

      setImageFile(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error saving product.",
      });
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleOrderStatus = async (id) => {
    try {
      await api.patch(`/orders/${id}/status`);
      await fetchOrders();
    } catch (err) {
      alert("Failed to update order.");
    }
  };

  // ================= DELETE ORDER =================
  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${id}`);
      await fetchOrders();
    } catch (err) {
      alert("Failed to delete order.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="container">

          {/* ================= ADD PRODUCT ================= */}
          <div
            className="form-card"
            style={{
              marginBottom: "3rem",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h2>🛒 Admin – Add New Product</h2>

            {message.text && (
              <div
                className={
                  "alert " +
                  (message.type === "success"
                    ? "alert-success"
                    : "alert-error")
                }
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Saree">Saree</option>
                  <option value="Bedsheet">Bedsheet</option>
                  <option value="Lungi">Lungi</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Carpet">Carpet</option>
                  <option value="Curtains">Curtains</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  id="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  id="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={handleFileChange} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary" style={{ width: "100%" }}>
                Save Product
              </button>
            </form>
          </div>

          {/* ================= CUSTOMER ORDERS ================= */}
          <div className="section">
            <h2>📦 Customer Orders</h2>

            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders placed yet.</p>
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

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => toggleOrderStatus(order._id)}
                      >
                        {order.status === "Pending"
                          ? "Mark as Shipped"
                          : "Mark as Pending"}
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteOrder(order._id)}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
};

export default AdminPage;
