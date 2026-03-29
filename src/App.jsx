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
import Orders from "./pages/Orders";
import Invoice from "./pages/Invoice";

// ADMIN
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminHistory from "./pages/Admin/AdminHistory";
import AdminOrders from "./pages/Admin/AdminOrders";

import { CartProvider } from "./context/CartContext";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Protect admin routes
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Protect normal routes
function ProtectedLayout() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <Routes>
          {/* NORMAL */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:type" element={<ProductsList />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/address" element={<Address />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/invoice/:invoice_id" element={<Invoice />} />

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Catch-all redirect for unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
