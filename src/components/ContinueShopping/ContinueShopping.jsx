import "./ContinueShopping.css";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

function ContinueShopping() {

  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const { user, BASE_URL } = useContext(AuthContext);

  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {

    if (!user) {
      setRecentProducts([]);
      return;
    }

    fetch(`${BASE_URL}/products/history/${user.id}`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {

          const unique = Array.from(
            new Map(data.map(p => [p.id, p])).values()
          );

          setRecentProducts(unique);

        } else {
          setRecentProducts([]);
        }

      })
      .catch(() => setRecentProducts([]));

  }, [user, BASE_URL]);

  return (

    <section className="continue">

      <div className="continue-header">

        <h2>Continue Shopping</h2>

        {recentProducts.length > 0 && (
          <span
            className="see-all"
            onClick={() => navigate("/products/continue")}
          >
            See more
          </span>
        )}

      </div>

      <div className="continue-row">

        {recentProducts.length === 0 ? (

          <p style={{ padding: "20px", color: "#555" }}>
            Start browsing products to see them here! 🛍️
          </p>

        ) : (

          recentProducts.map((item) => (

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

          ))

        )}

      </div>

    </section>

  );

}

export default ContinueShopping;
