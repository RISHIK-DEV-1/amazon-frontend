import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart, markOrdered } = useContext(CartContext);
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // ✅ NEW: saved address
  const [savedAddress, setSavedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // ✅ FETCH SAVED ADDRESS
  useEffect(() => {
    fetch(`${BASE_URL}/address`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error("No address");
        return res.json();
      })
      .then((data) => setSavedAddress(data))
      .catch(() => setSavedAddress(null))
      .finally(() => setLoadingAddress(false));
  }, []);

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
          payment_mode: paymentMode,
        }),
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Order failed");

      window.location.href = `/invoice/${data.invoice_id}`;

      markOrdered(cart);
      setShowSuccess(true);

      setTimeout(() => {
        clearCart();
        setShowSuccess(false);
      }, 2500);
    } catch (err) {
      setPaymentError(err.message || "Order failed");
    }
  };

  const displayItems = showSuccess ? orderItems : cart;

  return (
    <div className="checkout-page">
      <h2>Order Summary</h2>

      {/* ✅ ADDRESS SECTION */}
      <div className="checkout-address-box">
        <h3>Delivery Address</h3>

        {loadingAddress ? (
          <p>Loading address...</p>
        ) : savedAddress ? (
          <>
            <p>
              <b>Address:</b> {savedAddress.address}
            </p>
            <p>
              <b>Pincode:</b> {savedAddress.pincode}
            </p>

            <button onClick={() => navigate("/address")}>
              Change Address
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "red" }}>No address found</p>
            <button onClick={() => navigate("/address")}>
              Add Address
            </button>
          </>
        )}
      </div>

      {/* PRODUCTS */}
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

      <button onClick={() => setPaymentOpen(true)}>
        Proceed to Payment
      </button>

      {showSuccess && (
        <div className="success-msg">✓ Your order placed successfully</div>
      )}

      {/* PAYMENT MODAL */}
      {paymentOpen && (
        <div className="payment-modal">
          <div className="payment-content">
            <h3>Payment</h3>
            <p>Total: ₹{total}</p>

            {/* SHOW ADDRESS AGAIN */}
            {savedAddress && (
              <div className="mini-address">
                <p>{savedAddress.address}</p>
                <p>{savedAddress.pincode}</p>
              </div>
            )}

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

                if (!savedAddress) {
                  setPaymentError("Add address first");
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
