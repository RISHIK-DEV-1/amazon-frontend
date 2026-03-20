import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import ProductsList from "./pages/ProductsList";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Address from "./pages/Address";

import { CartProvider } from "./context/CartContext";
import { AuthContext, AuthProvider } from "./context/AuthContext";


function ProtectedLayout() {

  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="app-container">   {/* ✅ FIX */}

      <Header />

      <div className="app-content">   {/* ✅ FIX */}
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/products/:type" element={<ProductsList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/address" element={<Address />} />

        </Routes>
      </div>

      <Footer />

    </div>
  );
}


function App() {

  return (
    <AuthProvider>
      <CartProvider>

        <Router>

          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedLayout />} />

          </Routes>

        </Router>

      </CartProvider>
    </AuthProvider>
  );
}

export default App;
