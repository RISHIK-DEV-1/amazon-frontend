import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cart, clearCart, increaseQty, decreaseQty } =
    useContext(CartContext);

  const [showSuccess, setShowSuccess] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

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

  const handlePlaceOrder = () => {
    // Save current cart for display
    setOrderItems(cart);
    // Show success message
    setShowSuccess(true);

    // Clear cart after showing message
    setTimeout(() => {
      clearCart();
      setShowSuccess(false);
    }, 2500);
  };

  // Use orderItems if success is showing, otherwise use cart
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

            <div
              className="checkout-qty"
              style={{ display: "flex", gap: "12px", alignItems: "center" }}
            >
              <button
                onClick={() => !showSuccess && decreaseQty(item.id)}
                disabled={showSuccess}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => !showSuccess && increaseQty(item.id)}
                disabled={showSuccess}
              >
                +
              </button>
            </div>

            <p>Subtotal: ₹{item.quantity * Number(item.price)}</p>
          </div>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>

      <button
        className="place-order-btn"
        onClick={handlePlaceOrder}
        disabled={showSuccess}
      >
        Confirm Order
      </button>

      {/* SUCCESS MESSAGE BELOW BUTTON */}
      {showSuccess && (
        <div className="success-msg">✓ Your order placed successfully</div>
      )}
    </div>
  );
}

export default Checkout;
