import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import "./ProductDetails.css";
import { CartContext } from "../context/CartContext";
import { AuthContext, BASE_URL } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, isInCart, removeFromCart } = useContext(CartContext);
  const { user, authHeaders, logout } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [msg, setMsg] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const hasLogged = useRef(false);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.id) {
          setProduct(null);
          return;
        }
        setProduct(data);

        if (user && !hasLogged.current) {
          hasLogged.current = true;
          fetch(`${BASE_URL}/products/view/${user.id}/${data.id}`, {
            method: "POST",
          }).catch(() => {});
        }
      })
      .catch(() => setProduct(null));
  }, [id, user]);

  if (!product) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    showMsg("Added to cart");
  };

  const handleBuy = () => {
    setPaymentAmount(product.price * quantity);
    setPaymentMode("");
    setPaymentError("");
    setPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    const expectedAmount = product.price * quantity;

    if (Number(paymentAmount) !== expectedAmount) {
      setPaymentError(`Payment must be ₹${expectedAmount}`);
      return;
    }

    if (!paymentMode) {
      setPaymentError("Please select a payment mode");
      return;
    }

    fetch(`${BASE_URL}/orders/${product.id}`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: expectedAmount,
        quantity,
        payment_mode: paymentMode,
      }),
    })
      .then((res) => {
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error("Order failed");

        setOrderPlaced(true);
        setPaymentOpen(false);
        showMsg(`Order placed successfully via ${paymentMode}`);
      })
      .catch(() => setPaymentError("Payment failed"));
  };

  const handleCancelOrder = () => {
    setOrderPlaced(false);
    showMsg("Order cancelled");
  };

  return (
    <main className="product-details">
      <div className="product-details-card">
        <img src={product.image} alt={product.title} />
        <div className="product-info">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          <div className="features">
            <h3>About this item</h3>
            <ul>
              {product.features?.split(",").map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
          </div>

          <div className="quantity-selector">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="action-buttons">
            {!isInCart(product.id) ? (
              <button className="add-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            ) : (
              <button className="add-cart added" disabled>
                ✔ Added
              </button>
            )}

            {isInCart(product.id) && (
              <button
                className="remove-cart"
                onClick={() => removeFromCart(product.id)}
              >
                Remove
              </button>
            )}

            <button className="buy-now" onClick={handleBuy}>
              Buy Now
            </button>

            {orderPlaced && (
              <button className="cancel-order" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            )}

            {msg && <div className="success-msg">{msg}</div>}
          </div>
        </div>
      </div>

      {paymentOpen && (
        <div className="payment-modal">
          <div className="payment-content">
            <h3>Payment</h3>
            <p>Total Amount: ₹{product.price * quantity}</p>

            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <div className="payment-modes">
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="UPI"
                  checked={paymentMode === "UPI"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Card"
                  checked={paymentMode === "Card"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Card
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="Wallet"
                  checked={paymentMode === "Wallet"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                Wallet
              </label>
            </div>

            {paymentError && <div className="payment-error">{paymentError}</div>}

            <div className="payment-buttons">
              <button
                className="confirm-payment"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </button>
              <button
                className="cancel-payment"
                onClick={() => setPaymentOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductDetails;
