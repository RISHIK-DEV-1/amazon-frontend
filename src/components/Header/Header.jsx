import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

function Header() {

  const { cart } = useContext(CartContext);
  const { user, logout, BASE_URL } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const searchRef = useRef();

  const savedPincode = localStorage.getItem("deliveryPincode");

  useEffect(() => {
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else if (data.products) setProducts(data.products);
        else setProducts([]);
      })
      .catch(() => setProducts([]));
  }, [BASE_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchText("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
    setSearchText("");
  };

  const filtered =
    searchText.trim().length > 0
      ? products.filter(p => {
          const q = searchText.toLowerCase();
          return (
            p.title?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          );
        })
      : [];

  return (
    <>
      {/* SIDE MENU */}
      <div className={`side-menu ${menuOpen ? "open" : ""}`}>

        <div className="side-menu-header">
          <span>Hello, {user ? user.name : "Guest"}</span>
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
        <Link to="/products/deals" onClick={() => setMenuOpen(false)}>🔥 Deals</Link>
        <Link to="/products/recommended" onClick={() => setMenuOpen(false)}>⭐ Recommended</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>🛒 Your Cart</Link>

        {/* ✅ NEW: USER ORDERS */}
        {user && (
          <Link to="/orders" onClick={() => setMenuOpen(false)}>
            📦 My Orders
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            🛠 Admin Panel
          </Link>
        )}

        {user && (
          <span className="logout-text" onClick={logout}>🚪 Logout</span>
        )}

      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <header className="header">

        {/* TOP */}
        <div className="top-bar">

          <div className="top-bar-left">
            <div className="menu" onClick={() => setMenuOpen(true)}>☰</div>
            <span className="home-btn" onClick={() => navigate("/")}>🏠</span>
          </div>

          <div className="top-bar-center">
            <Link to="/">
              <img className="logo"
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
              />
            </Link>
          </div>

          <div className="top-bar-right">

            {/* ✅ NEW: DESKTOP ORDERS */}
            {user && (
              <span className="header-orders" onClick={() => navigate("/orders")}>
                📦 Orders
              </span>
            )}

            <Link to="/cart" className="header-cart">
              🛒
              <span className="cart-count">{cart.length}</span>
            </Link>

          </div>

        </div>

        {/* SEARCH */}
        <div className="search-row" ref={searchRef}>
          <div className="search-bar">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search Amazon.in"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>🔍</button>
          </div>

          {searchText && filtered.length > 0 && (
            <div className="search-dropdown">
              {filtered.slice(0, 6).map(item => (
                <div key={item.id}
                  className="search-item"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setSearchText("");
                  }}
                >
                  <img src={item.image} />
                  <div className="search-text">
                    <span>{item.title}</span>
                    <small>₹{item.price}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="bottom-bar">

          <div className="user-item" onClick={() => navigate("/address")}>
            📍 {savedPincode || "Select address"}
          </div>

          <div className="user-item">
            Hello, {user ? user.name : "Guest"}
          </div>

          {/* ✅ ORDERS HERE ALSO */}
          {user && (
            <div className="user-item" onClick={() => navigate("/orders")}>
              📦 Orders
            </div>
          )}

          {user?.role === "admin" && (
            <div className="user-item" onClick={() => navigate("/admin")}>
              🛠 Admin
            </div>
          )}

          {user && (
            <div className="user-item" onClick={logout}>
              Logout
            </div>
          )}

        </div>

      </header>
    </>
  );
}

export default Header;
