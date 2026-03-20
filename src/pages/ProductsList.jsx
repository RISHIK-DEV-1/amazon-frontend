import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./ProductsList.css";

function ProductsList() {

  const { type } = useParams();
  const navigate = useNavigate();

  const { user, BASE_URL } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [data, setData] = useState([]);

  useEffect(() => {

    // CONTINUE SHOPPING (FROM BACKEND HISTORY)
    if (type === "continue" && user) {

      fetch(`${BASE_URL}/products/history/${user.id}`)
        .then((res) => res.json())
        .then((products) => {

          if (Array.isArray(products)) {

            const unique = Array.from(
              new Map(products.map(p => [p.id, p])).values()
            );

            setData(unique);

          } else {
            setData([]);
          }

        })
        .catch(() => setData([]));

      return;
    }

    // CATEGORY PRODUCTS
    if (type !== "continue") {

      fetch(`${BASE_URL}/products/category/${type}`)
        .then((res) => res.json())
        .then((products) => {

          if (Array.isArray(products)) {
            setData(products);
          } else if (products.products) {
            setData(products.products);
          } else {
            setData([]);
          }

        })
        .catch(() => setData([]));

    }

  }, [type, user, BASE_URL]);

  return (

    <div className="products-list">

      <h2 className="list-title">
        {type === "deals"
          ? "Deals of the Day"
          : type === "recommended"
          ? "Recommended for You"
          : "Continue Shopping"}
      </h2>

      {data.length === 0 ? (

        <div className="empty-state">
          Start browsing products to see your recently viewed items here 🛍️
        </div>

      ) : (

        <div className="products-grid">

          {data.map((item) => (

            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`, { state: item })}
            >

              <img src={item.image} alt={item.title} />

              <p className="title">{item.title}</p>

              {item.price && (
                <p className="price">₹{item.price}</p>
              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default ProductsList;
