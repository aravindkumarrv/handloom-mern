// frontend/src/pages/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";

const AdminLoginPage = () => {
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

      if (user.role !== "admin") {
        setMessage({
          type: "error",
          text: "You are not authorized as admin.",
        });
        return;
      }

      localStorage.setItem("handloomUser", JSON.stringify(user));
      setMessage({ type: "success", text: "Admin login successful." });
      navigate("/admin");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid admin credentials.";
      setMessage({ type: "error", text: msg });
    }
  };

  return (
    <>
      <Navbar />
      <main className="form-page">
        <div className="form-card">
          <h2>Admin Login</h2>
          <p>Restricted area for handloom society staff only.</p>

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
              <label htmlFor="email">Admin email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@handloom.com"
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
                placeholder="admin123"
                value={form.password}
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
              Login as Admin
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>Default admin: admin@handloom.com / admin123</span>
          <span>Change it later in DB / code.</span>
        </div>
      </footer>
    </>
  );
};

export default AdminLoginPage;
