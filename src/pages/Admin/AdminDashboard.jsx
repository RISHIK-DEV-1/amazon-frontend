import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function AdminDashboard() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [data, setData] = useState(null);

  const fetchAnalytics = () => {
    fetch(`${BASE_URL}/admin/analytics`, {
      headers: authHeaders()
    })
      .then(res => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then(setData);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  // 🔵 PIE COLORS (Blue theme)
  const PIE_COLORS = ["#2196f3", "#42a5f5", "#64b5f6", "#90caf9"];

  return (
    <div>
      <h2>📊 Dashboard</h2>

      {/* ================= CARDS ================= */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          📦 Products
          <p>{data.total_products}</p>
        </div>

        <div className="dashboard-card">
          👤 Users
          <p>{data.total_users}</p>
        </div>

        <div className="dashboard-card">
          👁 Views
          <p>{data.total_views}</p>
        </div>

        <div className="dashboard-card">
          👑 Admins
          <p>{data.total_admins}</p>
        </div>
      </div>

      {/* ================= ORDER STATUS PIE ================= */}
      <div className="analytics-section">
        <h3>📦 Order Status</h3>

        {!data.order_status || data.order_status.length === 0 ? (
          <p className="empty-chart">No order data available</p>
        ) : (
          <div style={{ maxWidth: "400px", margin: "auto" }}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.order_status}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={90}
                  label
                >
                  {data.order_status.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <div className="analytics-section">
        <h3>🔥 Top Products</h3>

        {!data.top_products || data.top_products.length === 0 ? (
          <p className="empty-chart">No product data available</p>
        ) : (
          <div style={{ maxWidth: "600px", margin: "auto" }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.top_products} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="views"
                  fill="#4caf50"  // 🟢 GREEN
                  barSize={25}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================= ACTIVE USERS ================= */}
      <div className="analytics-section">
        <h3>👤 Active Users</h3>

        {!data.active_users || data.active_users.length === 0 ? (
          <p className="empty-chart">No user activity yet</p>
        ) : (
          data.active_users.map((u, i) => (
            <div key={i} className="analytics-row">
              <span>{u.username}</span>
              <span>{u.activity}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
