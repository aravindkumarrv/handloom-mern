// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/auth/login", form);
      const user = res.data.user;
      localStorage.setItem("handloomUser", JSON.stringify(user));
      setMessage({ type: "success", text: "Login successful." });

      // Normal users: maybe go to products
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      setMessage({ type: "error", text: msg });
    }
  };

  return (
    <>
      <Navbar />
      <main className="form-page">
        <div className="form-card">
          <h2>Customer Login</h2>
          <p>Login to place purchase enquiries and track orders.</p>

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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-footer">
              <span style={{ fontSize: "0.8rem" }}>
                New user? <Link to="/register">Create account</Link>
              </span>
              <a href="#">Forgot password?</a>
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
              Login
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Customer login connected with backend (demo auth).</span>
          <span>Add stronger security for real deployment.</span>
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
