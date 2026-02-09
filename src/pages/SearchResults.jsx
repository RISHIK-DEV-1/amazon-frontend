import { useLocation, useNavigate } from "react-router-dom";
import products from "../data/products";
import "./ProductsList.css";

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  const results = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="products-list">
      <h2 className="list-title">Search results for "{query}"</h2>

      {results.length === 0 ? (
        <p style={{ padding: "20px", fontSize: "16px" }}>❌ No results found</p>
      ) : (
        <div className="products-grid">
          {results.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => navigate(`/product/${item.id}`, { state: item })}
            >
              <img src={item.image} alt={item.title} />
              <p className="title">{item.title}</p>
              <p className="price">{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
