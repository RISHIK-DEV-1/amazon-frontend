import "./Recommended.css";  
import { useNavigate } from "react-router-dom";  
import { useEffect, useState } from "react";  

// ---------- BASE URL for backend ----------
const BASE_URL = "https://amazon-backend-production-219d.up.railway.app";

function Recommended() {  
  const navigate = useNavigate();  
  const [recommended, setRecommended] = useState([]);  

  useEffect(() => {  
    fetch(`${BASE_URL}/products/category/recommended`)  
      .then(res => res.json())  
      .then(data => setRecommended(data));  
  }, []);  

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
            onClick={() => navigate(`/product/${item.id}`)}  
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
