import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext, BASE_URL } from "../context/AuthContext"; // use BASE_URL
import "./ProductsList.css";

function ProductsList() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (type === "continue" && user) {
      // Load recent products for the logged-in user
      const key = `recentViewed_${user.email}`;
      const stored = localStorage.getItem(key);
      setData(stored ? JSON.parse(stored) : []);
    } else if (type !== "continue") {
      // Fetch products from backend by category
      fetch(`${BASE_URL}/products/category/${type}`)
        .then((res) => res.json())
        .then((products) => setData(products))
        .catch((err) => {
          console.error("Error fetching products:", err);
          setData([]);
        });
    } else {
      setData([]);
    }
  }, [type, user]);

  return (
    <div className="products-list">
      <h2 className="list-title">
        {type === "deals"
          ? "Deals of the Day"
          : type === "recommended"
          ? "Recommended for You"
          : "Continue Shopping"}
      </h2>

      <div className="products-grid">
        {data.length === 0 ? (
          <p style={{ padding: "20px", color: "#555", fontSize: "16px" }}>
            Start browsing products to see your recently viewed items here! 🛍️
          </p>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`, { state: item })}
            >
              <img src={item.image} alt={item.title} />
              <p className="title">{item.title}</p>
              {item.price && <p className="price">₹{item.price}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsList;
