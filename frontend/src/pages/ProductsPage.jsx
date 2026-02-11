// frontend/src/pages/ProductsPage.jsx
import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // Get logged in user
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("handloomUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res;

        if (user && user.role === "admin") {
          res = await api.get("/products/admin");
        } else {
          res = await api.get("/products");
        }

        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // ================= FILTER LOGIC =================
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "all" || p.category === activeCategory;

    const s = searchText.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s);

    return matchCategory && matchSearch;
  });

  // ================= DELETE PRODUCT =================
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    }
  };

  // ================= TOGGLE AVAILABILITY =================
  const toggleAvailability = async (product) => {
    try {
      const res = await api.patch(
        `/products/${product._id}/availability`,
        { available: !product.available }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? res.data : p
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to update availability.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Handloom Collections</h2>
            <p>
              Browse sarees, bedsheets, lungis, uniforms, carpets and curtains
              woven by our society weavers.
            </p>
          </div>

          {/* ================= FILTER BAR ================= */}
          <div className="filters-bar">
            <div className="filters-group">
              <label>Category:</label>
              {[
                { label: "All", value: "all" },
                { label: "Saree", value: "Saree" },
                { label: "Bedsheet", value: "Bedsheet" },
                { label: "Lungi", value: "Lungi" },
                { label: "Uniform", value: "Uniform" },
                { label: "Carpet", value: "Carpet" },
                { label: "Curtains", value: "Curtains" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  className={
                    "category-pill" +
                    (activeCategory === cat.value ? " active" : "")
                  }
                  onClick={() => setActiveCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="filters-group">
              <label htmlFor="search">Search:</label>
              <input
                id="search"
                className="search-input"
                type="text"
                placeholder="Search by name, color, pattern..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* ================= PRODUCTS GRID ================= */}
          {loading ? (
            <p style={{ marginTop: "1rem", color: "#777" }}>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p style={{ marginTop: "1rem", color: "#777" }}>
              No products found.
            </p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const stock = Number(product.stock ?? 0);
                const outOfStock = stock <= 0;

                return (
                  <article key={product._id} className="product-card">
                    <img src={product.image} alt={product.name} />

                    <div className="product-body">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3 className="product-title">{product.name}</h3>

                      <p style={{ fontSize: "0.85rem", color: "#777" }}>
                        {product.description}
                      </p>

                      <div className="product-meta">
                        <span className="product-price">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="badge-soft">Handloom</span>
                      </div>

                      {/* ADMIN STATUS BADGE */}
                      {user && user.role === "admin" && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: product.available ? "green" : "#b83232",
                            marginTop: "0.3rem",
                          }}
                        >
                          {product.available
                            ? "Available"
                            : "Unavailable"}
                        </p>
                      )}

                      {/* STOCK INFO */}
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: outOfStock ? "#a12b2b" : "#555",
                          marginTop: "0.25rem",
                        }}
                      >
                        {outOfStock
                          ? "Currently out of stock"
                          : `In stock: ${stock} pcs`}
                      </p>

                      {/* ================= BUTTONS ================= */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          marginTop: "0.8rem",
                        }}
                      >
                        {user && user.role === "admin" ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline"
                              style={{
                                width: "100%",
                                justifyContent: "center",
                                fontSize: "0.78rem",
                                borderRadius: "0.6rem",
                              }}
                              onClick={() =>
                                toggleAvailability(product)
                              }
                            >
                              {product.available
                                ? "Make Unavailable"
                                : "Make Available"}
                            </button>

                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{
                                width: "100%",
                                justifyContent: "center",
                                fontSize: "0.78rem",
                                borderRadius: "0.6rem",
                                background:
                                  "linear-gradient(135deg, #b83232, #7c1f1f)",
                              }}
                              onClick={() =>
                                handleDelete(product._id)
                              }
                            >
                              Delete Product
                            </button>
                          </>
                        ) : user ? (
                          <Link
                            to={`/order/${product._id}`}
                            className="btn btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              opacity: outOfStock ? 0.6 : 1,
                              pointerEvents: outOfStock
                                ? "none"
                                : "auto",
                            }}
                          >
                            {outOfStock
                              ? "Out of Stock"
                              : "Buy Now"}
                          </Link>
                        ) : (
                          <Link
                            to="/login"
                            className="btn btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                            }}
                          >
                            Login to Buy
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>
            Need bulk or institutional orders? Contact society office.
          </span>
          <span>This demo now supports real order placement.</span>
        </div>
      </footer>
    </>
  );
};

export default ProductsPage;
