import Navbar from "../components/Navbar";

const OrderSuccessPage = () => {
  return (
    <>
      <Navbar />
      <div className="form-page">
        <div className="form-card">
          <h2>Order Placed Successfully 🎉</h2>
          <p>Your order will be delivered within 5 working days.</p>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
