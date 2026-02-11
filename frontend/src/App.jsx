// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// ✅ NEW PAGES
import OrderPage from "./pages/OrderPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* ✅ NEW ROUTES */}
      <Route path="/order/:id" element={<OrderPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/admin-orders" element={<AdminOrdersPage />} />
    </Routes>
  );
}

export default App;
