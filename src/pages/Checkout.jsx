import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart, markOrdered } = useContext(CartContext);
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty.</h2>
      </div>
    );
  }

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  const handlePlaceOrder = async () => {
    try {
      setOrderItems(cart);

      const res = await fetch(`${BASE_URL}/orders/bulk`, {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            amount: item.quantity * Number(item.price),
          })),
          address,
          pincode,
          payment_mode: paymentMode,
        }),
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Order failed");

      if (!data.invoice_id) throw new Error("Invoice ID missing from backend");

      // Navigate to invoice page
      window.location.href = `/invoice/${data.invoice_id}`;

      markOrdered(cart);
      setShowSuccess(true);

      setTimeout(() => {
        clearCart();
        setShowSuccess(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setPaymentError(err.message || "Order failed. Please try again.");
    }
  };

  const displayItems = showSuccess ? orderItems : cart;

  return (
    <div className="checkout-page">
      <h2>Order Summary</h2>

      {displayItems.map((item) => (
        <div key={item.id} className="checkout-item">
          <img src={item.image} alt={item.title} />
          <div className="checkout-info">
            <p>{item.title}</p>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: ₹{item.quantity * Number(item.price)}</p>
          </div>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button onClick={() => setPaymentOpen(true)}>Proceed to Payment</button>

      {showSuccess && (
        <div className="success-msg">✓ Your order placed successfully</div>
      )}

      {/* PAYMENT MODAL */}
      {paymentOpen && (
        <div className="payment-modal">
          <div className="payment-content">
            <h3>Payment & Address</h3>
            <p>Total: ₹{total}</p>

            <label>
              Address:
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
              />
            </label>

            <label>
              Pincode:
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
              />
            </label>

            <div className="payment-modes">
              <label>
                <input
                  type="radio"
                  value="UPI"
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  value="Card"
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Card
              </label>
              <label>
                <input
                  type="radio"
                  value="Wallet"
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Wallet
              </label>
            </div>

            {paymentError && <p className="error">{paymentError}</p>}

            <button
              onClick={() => {
                if (!paymentMode) {
                  setPaymentError("Select payment method");
                  return;
                }
                if (!address || !pincode) {
                  setPaymentError("Provide address and pincode");
                  return;
                }
                setPaymentOpen(false);
                handlePlaceOrder();
              }}
            >
              Confirm Payment
            </button>

            <button onClick={() => setPaymentOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
