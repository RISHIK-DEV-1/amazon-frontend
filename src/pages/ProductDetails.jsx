import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "./ProductDetails.css";
import { CartContext } from "../context/CartContext";
import { AuthContext, BASE_URL } from "../context/AuthContext"; // Added BASE_URL

function ProductDetails() {
  const { id } = useParams();
  const { addToCart, isInCart, removeFromCart, cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Load product from backend
  useEffect(() => {
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        if (user) saveRecentViewed(data, user.email); // Save dynamically
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id, user]);

  // Save recently viewed product to localStorage
  const saveRecentViewed = (item, userEmail) => {
    const key = `recentViewed_${userEmail}`;
    const stored = localStorage.getItem(key);
    let recent = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    recent = recent.filter((p) => p.id !== item.id);
    // Add to front
    recent.unshift(item);
    // Keep max 10 items
    if (recent.length > 10) recent = recent.slice(0, 10);

    localStorage.setItem(key, JSON.stringify(recent));

    // Notify ContinueShopping component
    window.dispatchEvent(new Event("recentViewedUpdated"));
  };

  if (!product) return <h2 style={{ padding: "20px" }}>Loading...</h2>;

  const handleAddToCart = () => addToCart({ ...product, quantity });

  return (
    <div className="product-details">
      <div className="product-details-card">
        <img src={product.image} alt={product.title} />
        <div className="product-info">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>

          <div className="quantity-selector">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
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
              <button className="remove-cart" onClick={() => removeFromCart(product.id)}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
