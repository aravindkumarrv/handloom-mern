import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api";

const OrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    quantity: 1,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/products").then((res) => {
      const found = res.data.find((p) => p._id === id);
      setProduct(found);
    });
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.quantity > product.stock) {
      setMessage(`Only ${product.stock} items available.`);
      return;
    }

    await api.post("/orders", {
      productId: product._id,
      ...form,
    });

    navigate("/order-success");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="form-page">
        <div className="form-card">
          <h2>Order: {product.name}</h2>

          {message && <div className="alert alert-error">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input id="customerName" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input id="phone" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Shipping Address With PINCODE</label>
              <textarea id="address" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Quantity (Available: {product.stock})</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={form.quantity}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary" style={{ width: "100%" }}>
              Place Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
