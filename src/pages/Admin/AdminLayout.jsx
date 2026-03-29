import { Outlet, NavLink } from "react-router-dom";
import "./Admin.css";

function AdminLayout() {
  return (
    <div className="admin-container">

      <nav className="admin-navbar">
        <h2>Admin Panel</h2>

        <div className="nav-links">
          <NavLink to="/admin">📊 Dashboard</NavLink>
          <NavLink to="/admin/products">📦 Products</NavLink>
          <NavLink to="/admin/users">👤 Users</NavLink>
          <NavLink to="/admin/history">📜 History</NavLink>

          {/* ✅ NEW */}
          <NavLink to="/admin/orders">🛒 Orders</NavLink>
        </div>
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;
