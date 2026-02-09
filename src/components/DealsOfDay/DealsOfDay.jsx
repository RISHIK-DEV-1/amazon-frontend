import "./DealsOfDay.css";
import { useNavigate } from "react-router-dom";
import products from "../../data/products";

function DealsOfDay() {
  const navigate = useNavigate();

  const deals = products.filter((p) => p.category === "deals");

  return (
    <section className="deals">
      <div className="deals-header">
        <h2>Deals of the Day</h2>
        <span className="see-all" onClick={() => navigate("/products/deals")}>
          See more
        </span>
      </div>

      <div className="deals-row">
        {deals.map((item) => (
          <div
            key={item.id}
            className="deal-card"
            onClick={() => navigate(`/product/${item.id}`, { state: item })}
          >
            <img src={item.image} alt={item.title} />
            <p className="deal-title">{item.title}</p>
            <strong className="deal-price">₹{item.price}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DealsOfDay;
