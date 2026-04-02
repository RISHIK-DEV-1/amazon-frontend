import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    isOrdered,

    // ✅ NEW
    toggleSelect,
    isSelected,
    selectedItems,
  } = useContext(CartContext);

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="cart-empty-page">
        <h2>Your cart is empty</h2>
      </main>
    );
  }

  // ✅ total based on selected items
  const total = selectedItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  return (
    <main className="cart-page">
      {cart.map((item) => (
        <div key={item.id} className="cart-item">

          {/* ✅ CHECKBOX */}
          <input
            type="checkbox"
            className="cart-checkbox"
            checked={isSelected(item.id)}
            onChange={() => toggleSelect(item)} // ✅ FIXED
          />

          <img src={item.image} alt={item.title} />

          <div className="cart-item-details">
            <p className="title">{item.title}</p>
            <p className="price">₹{item.price}</p>

            {/* QUANTITY */}
            <div className="qty">
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>

            {/* ORDER STATUS */}
            {isOrdered(item.id) && (
              <p className="ordered-text">✔ Already Ordered</p>
            )}

            {/* REMOVE BUTTON */}
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* ✅ FOOTER SECTION */}
      <div className="cart-footer">
        <h3>Total (Selected): ₹{total}</h3>

        <button
          className="checkout-btn"
          disabled={selectedItems.length === 0}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}

export default Cart;
