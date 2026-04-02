import "./Recommended.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../context/AuthContext";

function Recommended() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${BASE_URL}/products/category/recommended`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && Array.isArray(data)) {
          setRecommended(data);
        }
      })
      .catch(() => {
        if (isMounted) setRecommended([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!recommended) return null;

  return (
    <section className="recommended">
      <div className="recommended-header">
        <h2>Recommended for You</h2>

        {recommended.length > 0 && (
          <span
            className="see-all"
            onClick={() => navigate("/products/recommended")}
          >
            See all
          </span>
        )}
      </div>

      <div className="recommended-row">
        {recommended.length === 0 ? (
          <p style={{ padding: "20px", color: "#555" }}>
            No recommendations available.
          </p>
        ) : (
          recommended.map((item) => (
            <div
              key={item.id}
              className="recommended-card"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img src={item.image} alt={item.title || "recommended"} />
              <p className="title">{item.title || "No title"}</p>
              <strong className="price">₹{item.price || "0"}</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Recommended;
