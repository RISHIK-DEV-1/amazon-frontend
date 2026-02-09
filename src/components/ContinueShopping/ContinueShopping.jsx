import "./ContinueShopping.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export const continueItems = [
  { id: 101, title: "HP Laptop", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", price: 54999, category: "continue" },
  { id: 102, title: "Bluetooth Headset", image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd", price: 1999, category: "continue" },
  { id: 103, title: "Office Chair", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7", price: 7999, category: "continue" },
  { id: 104, title: "Smartphone Case", image: "https://images.unsplash.com/photo-1580910051074-7c04b9f71f2e", price: 499, category: "continue" },
  { id: 105, title: "Wireless Mouse", image: "https://images.unsplash.com/photo-1527814050087-3793815479db", price: 899, category: "continue" },
  { id: 106, title: "Table Lamp", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", price: 1299, category: "continue" },
  { id: 107, title: "External Hard Drive", image: "https://images.unsplash.com/photo-1580910051074-7c04b9f71f2e", price: 4599, category: "continue" },
  { id: 108, title: "Mechanical Keyboard", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", price: 2999, category: "continue" },
  { id: 109, title: "Sports Shoes", image: "https://images.unsplash.com/photo-1528701800489-20be3c9e9a07", price: 3499, category: "continue" },
  { id: 110, title: "Water Bottle", image: "https://images.unsplash.com/photo-1526401485004-2fda9f4f1c2b", price: 299, category: "continue" },
];

function ContinueShopping() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);

  return (
    <section className="continue">
      <div className="continue-header">
        <h2>Continue Shopping</h2>
        <span className="see-all" onClick={() => navigate("/products/continue")}>
          See more
        </span>
      </div>

      <div className="continue-row">
        {continueItems.map((item) => (
          <div className="continue-card" key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              onClick={() => navigate(`/product/${item.id}`, { state: item })}
            />
            <p className="continue-title">{item.title}</p>
            <button
              className={`add-cart-btn ${isInCart(item.id) ? "added" : ""}`}
              disabled={isInCart(item.id)}
              onClick={() => addToCart(item)}
            >
              {isInCart(item.id) ? "✔ Added" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ContinueShopping;
