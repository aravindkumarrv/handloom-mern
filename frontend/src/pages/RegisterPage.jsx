// frontend/src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import api from "../api.js";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.name || !form.email || !form.password) {
      setMessage({ type: "error", text: "Fill all fields." });
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      setMessage({ type: "success", text: res.data.message });
      // small delay then go to login
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setMessage({ type: "error", text: msg });
    }
  };

  return (
    <>
      <Navbar />
      <main className="form-page">
        <div className="form-card">
          <h2>Create Customer Account</h2>
          <p>Register to enquire and buy handloom products online.</p>

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
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

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

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                marginTop: "1rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              Register
            </button>

            <p className="form-note">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>For demo only – passwords are not encrypted.</span>
          <span>Add proper hashing in a real system.</span>
        </div>
      </footer>
    </>
  );
};

export default RegisterPage;
