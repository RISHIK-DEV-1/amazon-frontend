import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const {
    cart,
    selectedItems,
    markOrdered,
    clearSelected,
  } = useContext(CartContext);

  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [savedAddress, setSavedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // FETCH ADDRESS
  useEffect(() => {
    fetch(`${BASE_URL}/address`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then((data) => setSavedAddress(data))
      .catch(() => setSavedAddress(null))
      .finally(() => setLoadingAddress(false));
  }, []);

  // PARSE ADDRESS
  const addr = (() => {
    try {
      return JSON.parse(savedAddress?.address || "{}");
    } catch {
      return {};
    }
  })();

  // DISPLAY LOGIC
  const displayItems =
    showSuccess || orderItems.length > 0
      ? orderItems
      : selectedItems;

  if (displayItems.length === 0 && orderItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>No products selected</h2>
        <button onClick={() => navigate("/cart")}>
          Go to Cart
        </button>
      </div>
    );
  }

  const total = displayItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  const handlePlaceOrder = async () => {
    try {
      setOrderItems(selectedItems);

      const res = await fetch(`${BASE_URL}/orders/bulk`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          items: selectedItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            amount: item.quantity * Number(item.price),
          })),
          payment_mode: paymentMode,
        }),
      });

      if (res.status === 401) return logout();

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Order failed");

      markOrdered(selectedItems);
      clearSelected();

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      setPaymentError(err.message || "Order failed");
    }
  };

  return (
    <div className="checkout-page">
      <h2>Order Summary</h2>

      {/* ADDRESS */}
      <div className="checkout-address-box">
        <h3>Delivery Address</h3>

        {loadingAddress ? (
          <p>Loading address...</p>
        ) : savedAddress ? (
          <>
            <div className="address-card">
              <p className="name">{addr.name}</p>
              <p>{addr.house}, {addr.area}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              {addr.phone && <p>📞 {addr.phone}</p>}
            </div>

            <button
              className="change-address-btn"
              onClick={() => navigate("/address")}
            >
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

      {!showSuccess && (
        <button onClick={() => setPaymentOpen(true)}>
          Proceed to Payment
        </button>
      )}

      {showSuccess && (
        <div className="success-msg">
          ✓ Order placed successfully
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentOpen && (
        <div className="payment-modal">
          <div className="payment-content">
            <h3>Payment</h3>
            <p>Total: ₹{total}</p>

            {savedAddress && (
              <div className="mini-address">
                <p className="name">{addr.name}</p>
                <p>{addr.city} - {addr.pincode}</p>
              </div>
            )}

            {/* ✅ FIXED RADIO GROUP */}
            <div className="payment-modes">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMode === "UPI"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                UPI
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={paymentMode === "Card"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Card
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Wallet"
                  checked={paymentMode === "Wallet"}
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

            <button onClick={() => setPaymentOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
