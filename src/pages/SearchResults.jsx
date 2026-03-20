import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../context/AuthContext";
import "./ProductsList.css";

function SearchResults() {

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {

    fetch(`${BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }

      })
      .catch(() => setProducts([]));

  }, []);

  useEffect(() => {

    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();

    const filtered = products.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );

    setResults(filtered);

  }, [query, products]);

  return (

    <div className="products-list">

      {query && (
        <h2 className="list-title">
          Search results for "{query}"
        </h2>
      )}

      {!query ? (

        <div className="empty-state">
          🔎 Search for products above
        </div>

      ) : results.length === 0 ? (

        <div className="empty-state">
          ❌ No products found
        </div>

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

export default SearchResults;
