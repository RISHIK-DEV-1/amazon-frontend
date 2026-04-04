import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminOrders.css";

function AdminOrders() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const showMsg = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 2000);
  };

  // Fetch grouped orders (by invoice_id)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/admin`, {
        headers: authHeaders(),
      });
      if (res.status === 401) return logout();
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status for all products in invoice
  const updateStatus = async (invoice_id, status) => {
    setUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/${invoice_id}?status=${status}`, {
        method: "PUT",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to update status");
      showMsg(`Marked as ${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      showMsg("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Delete entire invoice
  const deleteOrder = async (invoice_id) => {
    if (!window.confirm("Delete this entire order?")) return;
    setUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/${invoice_id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete order");
      showMsg("Order deleted");
      fetchOrders();
    } catch (err) {
      console.error(err);
      showMsg("Failed to delete order");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 20 }}>Loading orders...</p>;

  return (
    <div>
      <h2>📦 Orders</h2>
      {msg && <div className="success-msg">{msg}</div>}

      {orders.length === 0 ? (
        <p className="empty-state">No orders</p>
      ) : (
        orders.map((o) => {
          const status = o.status || "placed";

          // Split titles and images
          const titles = (o.titles || "").split(",");
          const images = (o.images || "").split(",");

          return (
            <div className="admin-row" key={o.invoice_id}>
              {/* SCROLLABLE IMAGES */}
              <div className="image-container">
                {images.map((img, idx) => (
                  <div className="product-image-wrapper" key={idx}>
                    <img src={img || "/placeholder.png"} alt={titles[idx] || "Product"} />
                    <span className="product-name" data-title={titles[idx] || "Unknown Product"}>
                      {titles[idx] || "Unknown Product"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="admin-info">
                <span>Total Qty: {o.total_qty || 1}</span>
                <small>User: {o.username || "Unknown"}</small>
                <span className={`status-badge ${status}`}>
                  {status.toUpperCase()}
                </span>
              </div>

              <div className="admin-actions">
                <button
                  className="ship-btn"
                  disabled={status !== "placed" || updating}
                  onClick={() => updateStatus(o.invoice_id, "shipped")}
                >
                  Ship
                </button>

                <button
                  className="deliver-btn"
                  disabled={status === "delivered" || updating}
                  onClick={() => updateStatus(o.invoice_id, "delivered")}
                >
                  Deliver
                </button>

                <button
                  className="delete-btn"
                  disabled={updating}
                  onClick={() => deleteOrder(o.invoice_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AdminOrders;
