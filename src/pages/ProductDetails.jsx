import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import "./ProductDetails.css";
import { CartContext } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, isInCart, removeFromCart, cart } = useContext(CartContext);

  const product = location.state || products.find((p) => String(p.id) === String(id));

  const existingItem = cart.find((item) => item.id === product?.id);
  const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity : 1);

  if (!product) return <h2 style={{ padding: "20px" }}>Product not found</h2>;

  const handleAddToCart = () => addToCart({ ...product, quantity });

  const handleRemove = () => removeFromCart(product.id);

  const handlePlaceOrder = () => {
    if (!isInCart(product.id)) addToCart({ ...product, quantity });
    navigate("/checkout");
  };

  return (
    <div className="product-details">
      <div className="product-details-card">
        <img src={product.image} alt={product.title} />

        <div className="product-info">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description || "No description available."}</p>

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
              <button className="remove-cart" onClick={handleRemove}>
                Remove
              </button>
            )}

            <button className="place-order" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
