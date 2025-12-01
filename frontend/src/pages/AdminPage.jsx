// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";

const AdminPage = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const navigate = useNavigate();

  // ✅ Only admin can access this page
  useEffect(() => {
    const raw = localStorage.getItem("handloomUser");
    if (!raw) {
      navigate("/admin-login");
      return;
    }
    const user = JSON.parse(raw);
    if (user.role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ✅ Load all products for admin list
  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get("/products/admin"); // backend route
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading admin products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.name || !form.category || !form.price || !form.description) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    const priceNum = Number(form.price);
    if (!priceNum || priceNum <= 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid price greater than zero.",
      });
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      fd.append("price", priceNum.toString());
      fd.append("description", form.description.trim());
      fd.append("stock", form.stock === "" ? "0" : form.stock.toString());
      if (imageFile) {
        fd.append("image", imageFile);
      }

      await api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: "Product added successfully!",
      });

      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
        stock: "",
      });
      setImageFile(null);

      // reload list so new product appears
      loadProducts();
    } catch (err) {
      console.error("Error adding product:", err);

      const backendMsg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while saving the product.";

      setMessage({
        type: "error",
        text: backendMsg,
      });
    }
  };

  // 🗑 DELETE product
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    }
  };

  // ✅ Toggle availability (Available / Unavailable)
  const handleToggleAvailability = async (product) => {
    try {
      await api.patch(`/products/${product._id}/availability`, {
        available: !product.available,
      });
      loadProducts();
    } catch (err) {
      console.error("Availability update error:", err);
      alert("Failed to update availability.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-card">
          <h2>Admin – Add New Product</h2>
          <p>
            This panel is meant for society staff only. Products added here will
            appear in the main listing page.
          </p>

          {message.text && (
            <div
              className={
                "alert " +
                (message.type === "success" ? "alert-success" : "alert-error")
              }
              style={{ display: "block" }}
            >
              {message.text}
            </div>
          )}

          {/* ===== ADD PRODUCT FORM ===== */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product name</label>
              <input
                type="text"
                id="name"
                required
                placeholder="Eg. Pure Cotton Temple Border Saree"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                required
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Saree">Saree</option>
                <option value="Bedsheet">Bedsheet</option>
                <option value="Lungi">Lungi</option>
                <option value="Uniform">Uniform</option>
                <option value="Carpet">Carpet</option>
                <option value="Curtains">Curtains</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                min="1"
                step="1"
                required
                placeholder="Eg. 2490"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock (pcs)</label>
              <input
                type="number"
                id="stock"
                min="0"
                step="1"
                required
                placeholder="Eg. 10"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Product image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="form-note">
                Choose an image from your system. It will be uploaded to the
                server and used in the product listing.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="description">Short description</label>
              <textarea
                id="description"
                required
                placeholder="Eg. Handwoven cotton saree / bedsheet / lungi with traditional patterns."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop: "1rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Save Product
            </button>

            <p className="form-note">
              After saving, open <strong>Products</strong> page to see the
              customer view. Images are stored on the backend using Multer.
            </p>
          </form>

          {/* ===== PRODUCT LIST + DELETE ===== */}
          <hr style={{ margin: "1.4rem 0", borderColor: "#eee" }} />

          <h3 style={{ marginBottom: "0.4rem", fontSize: "1.05rem" }}>
            Manage Existing Products
          </h3>
          <p className="form-note" style={{ marginBottom: "0.6rem" }}>
            Use <b>Delete</b> to remove a product permanently or toggle{" "}
            <b>Available / Unavailable</b>.
          </p>

          {loadingProducts ? (
            <p style={{ fontSize: "0.9rem", color: "#777" }}>Loading...</p>
          ) : products.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
              No products found. Add a new product above.
            </p>
          ) : (
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                borderRadius: "0.8rem",
                border: "1px solid rgba(0,0,0,0.06)",
                padding: "0.4rem 0.5rem",
                background: "#fffdf8",
              }}
            >
              {products.map((p) => (
                <div
                  key={p._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.35rem 0.25rem",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.87rem",
                        fontWeight: 600,
                        marginBottom: "0.1rem",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#777",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <span>{p.category}</span>
                      <span>₹{p.price}</span>
                      <span>Stock: {p.stock ?? 0}</span>
                      <span
                        style={{
                          padding: "0.1rem 0.45rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem",
                          background: p.available
                            ? "rgba(0,160,80,0.12)"
                            : "rgba(160,0,0,0.07)",
                          color: p.available ? "#0a7b3b" : "#a12b2b",
                        }}
                      >
                        {p.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.6rem",
                      }}
                      onClick={() => handleToggleAvailability(p)}
                    >
                      {p.available ? "Make Unavailable" : "Make Available"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.6rem",
                        background:
                          "linear-gradient(135deg, #b83232, #7c1f1f)",
                      }}
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Admin panel lets you manage visibility, stock and inventory.</span>
          <span>Extend with edit & bulk actions later.</span>
        </div>
      </footer>
    </>
  );
};

export default AdminPage;
