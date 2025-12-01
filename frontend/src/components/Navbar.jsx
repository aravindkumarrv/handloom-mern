import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Read user from localStorage on mount & on route change
  useEffect(() => {
    try {
      const raw = localStorage.getItem("handloomUser");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("handloomUser");
    setUser(null);
    navigate("/"); // back to home
  };

  return (
    <header className="header">
      <div className={`container nav ${open ? "open" : ""}`}>
        <div className="nav-left">
          <div className="logo-circle">H</div>
          <div className="brand-text">
            <span>Karunagappally Taluk Handloom Weavers Industrial Cooperative Society</span>
            <span>Edakulangara.P.O., Karunagappally, Kollam District, Kerala -690523</span>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/products"
            className={pathname === "/products" ? "active" : ""}
          >
            Products
          </Link>

          {/* Customer / Admin specific links */}
          {!user && (
            <>
              <Link
                to="/login"
                className={pathname === "/login" ? "active" : ""}
              >
                Customer Login
              </Link>
              <Link
                to="/admin-login"
                className={pathname === "/admin-login" ? "active" : ""}
              >
                Admin
              </Link>
            </>
          )}

          {user && user.role === "customer" && (
            <span style={{ fontSize: "0.8rem", color: "#666" }}>
              Hi, {user.name?.split(" ")[0] || "Customer"}
            </span>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className={pathname === "/admin" ? "active" : ""}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="nav-cta">
          {!user && (
            <>
              <Link to="/products" className="btn btn-outline">
                Browse
              </Link>
              <Link to="/login" className="btn btn-primary">
                Buy Online
              </Link>
            </>
          )}

          {user && (
            <>
              <button
                className="btn btn-outline"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            &#9776;
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
