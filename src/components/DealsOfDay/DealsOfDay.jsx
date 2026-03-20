import "./DealsOfDay.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../context/AuthContext"; // reuse constant

function DealsOfDay() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    let isMounted = true; // prevent state update after unmount

    fetch(`${BASE_URL}/products/category/deals`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && Array.isArray(data)) setDeals(data);
      })
      .catch(() => {
        if (isMounted) setDeals([]);
      });

    return () => { isMounted = false; };
  }, []);

  if (!deals) return null; // fail-safe

  return (
    <section className="deals">
      <div className="deals-header">
        <h2>Deals of the Day</h2>
        {deals.length > 0 && (
          <span className="see-all" onClick={() => navigate("/products/deals")}>
            See more
          </span>
        )}
      </div>

      <div className="deals-row">
        {deals.length === 0 ? (
          <p style={{ padding: "20px", color: "#555" }}>No deals available.</p>
        ) : (
          deals.map((item) => (
            <div
              key={item.id}
              className="deal-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.title || "deal"} />
              <p className="deal-title">{item.title || "No title"}</p>
              <strong className="deal-price">₹{item.price || "0"}</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default DealsOfDay;
