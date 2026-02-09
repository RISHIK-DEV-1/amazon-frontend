import "./Recommended.css";
import { useNavigate } from "react-router-dom";
import products from "../../data/products";

function Recommended() {
  const navigate = useNavigate();

  const recommended = products.filter((p) => p.category === "recommended");

  return (
    <section className="recommended">
      <div className="recommended-header">
        <h2>Recommended for You</h2>
        <span className="see-all" onClick={() => navigate("/products/recommended")}>
          See all
        </span>
      </div>

      <div className="recommended-row">
        {recommended.slice(0, 10).map((item) => (
          <div
            key={item.id}
            className="recommended-card"
            onClick={() => navigate(`/product/${item.id}`, { state: item })}
          >
            <img src={item.image} alt={item.title} />
            <p className="title">{item.title}</p>
            <strong className="price">₹{item.price}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Recommended;
