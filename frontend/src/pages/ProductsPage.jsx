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

  // current logged in user (customer or admin)
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("handloomUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

  // For now: simple alert when logged in user (customer) clicks Enquire / Buy
  const handleEnquire = (product) => {
    alert(
      `You are logged in.\n\nIn a real app, this is where you'd open an enquiry / order page for:\n\n${product.name} (₹${product.price})`
    );
  };

  // 🗑 Delete product (for admin use)
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this product permanently?");
    if (!ok) return;

    try {
      await api.delete(`/products/${id}`);
      // remove from UI list
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
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
              woven by our society weavers. Use filters to quickly find what you
              need.
            </p>
          </div>

          {/* FILTER BAR */}
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
                  data-category={cat.value}
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

          {/* PRODUCTS GRID */}
          {loading ? (
            <p style={{ marginTop: "1rem", color: "#777" }}>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p
              id="emptyState"
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#777",
              }}
            >
              No products found for this filter. Try changing the category or
              search text.
            </p>
          ) : (
            <div id="productsGrid" className="products-grid">
              {filteredProducts.map((product) => {
                // If stock field is present, use it. If not, treat as "no stock info".
                const hasStockField =
                  Object.prototype.hasOwnProperty.call(product, "stock") &&
                  product.stock !== null &&
                  product.stock !== undefined;

                const stock = hasStockField ? Number(product.stock) : null;
                const outOfStock =
                  hasStockField && !Number.isNaN(stock) && stock <= 0;

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

                      {/* stock info – only show detailed text if stock field exists */}
                      {hasStockField && (
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
                      )}

                      <div className="product-actions">
                        {/* 🌟 If ADMIN is logged in, show Delete button instead */}
                        {user && user.role === "admin" ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              background:
                                "linear-gradient(135deg, #b83232, #7c1f1f)",
                            }}
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete Product
                          </button>
                        ) : user ? (
                          // Normal logged-in customer
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              opacity: outOfStock ? 0.7 : 1,
                              cursor: outOfStock ? "not-allowed" : "pointer",
                            }}
                            disabled={outOfStock}
                            onClick={() =>
                              !outOfStock && handleEnquire(product)
                            }
                          >
                            {outOfStock ? "Out of stock" : "Enquire / Buy"}
                          </button>
                        ) : (
                          // Not logged in
                          <Link
                            to="/login"
                            className="btn btn-primary"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                            }}
                          >
                            Login to Enquire / Buy
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
          <span>Need bulk or institutional orders? Contact society office.</span>
          <span>This demo does not handle actual payments.</span>
        </div>
      </footer>
    </>
  );
};

export default ProductsPage;
