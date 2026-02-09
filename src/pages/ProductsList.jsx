import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import { continueItems } from "../components/ContinueShopping/ContinueShopping";
import "./ProductsList.css";

function ProductsList() {
  const { type } = useParams();
  const navigate = useNavigate();

  const data =
    type === "continue"
      ? continueItems
      : products.filter((p) => p.category === type);

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
        {data.map((item) => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => navigate(`/product/${item.id}`, { state: item })}
          >
            <img src={item.image} alt={item.title} />
            <p className="title">{item.title}</p>
            {item.price && <p className="price">₹{item.price}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
