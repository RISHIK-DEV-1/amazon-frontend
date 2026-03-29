import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeFromCart, isOrdered } =
    useContext(CartContext);

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <main className="cart-empty-page">
        <h2>Your cart is empty</h2>
      </main>
    );
  }

  return (
    <main className="cart-page">
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.title} />

          <div className="cart-item-details">
            <p>{item.title}</p>
            <p className="price">₹{item.price}</p>

            <div className="qty">
              <button onClick={() => decreaseQty(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>

            {isOrdered(item.id) && (
              <p style={{ color: "green" }}>✔ Already Ordered</p>
            )}

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button className="checkout-btn" onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </button>
    </main>
  );
}

export default Cart;
