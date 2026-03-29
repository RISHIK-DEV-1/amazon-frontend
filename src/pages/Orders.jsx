import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Orders.css";

function Orders() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${BASE_URL}/orders/my`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then((data) => setOrders(data || []))
      .catch((err) => {
        console.error(err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleTimeline = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId);
  };

  const cancelOrder = (id) => {
    if (!window.confirm("Cancel this order?")) return;

    fetch(`${BASE_URL}/orders/cancel/${id}`, {
      method: "PUT",
      headers: authHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel order");
        return res.json();
      })
      .then(() => fetchOrders())
      .catch((err) => alert(err.message));
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 20 }}>Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2>🛒 My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders yet</p>
      ) : (
        orders.map((o) => {
          const status = o.status || "placed";
          const timeline = Array.isArray(o.timeline) ? o.timeline : [];

          return (
            <div className="order-card" key={o.id}>
              <img src={o.image || "/placeholder.png"} alt={o.title || "Product"} />

              <div className="order-info">
                <strong>{o.title || "Unknown Product"}</strong>
                <span>₹{o.price ?? "N/A"}</span>

                <span className={`status ${status}`}>{status.toUpperCase()}</span>

                <small>
                  {o.created_at
                    ? new Date(o.created_at).toLocaleString()
                    : "Unknown date"}
                </small>

                <p>
                  <b>Delivery:</b> {o.address || "Not Provided"} ({o.pincode || "-"})
                </p>

                <p>
                  <b>Payment Mode:</b> {o.payment_mode || "Not Provided"}
                </p>

                <div className="order-actions">
                  <button onClick={() => toggleTimeline(o.id)}>
                    {openOrder === o.id ? "Hide Timeline" : "View Timeline"}
                  </button>

                  {status !== "delivered" && status !== "cancelled" && (
                    <button className="cancel-btn" onClick={() => cancelOrder(o.id)}>
                      Cancel
                    </button>
                  )}

                  <button onClick={() => navigate(`/invoice/${o.id}`)}>View Invoice</button>
                </div>

                {openOrder === o.id && (
                  <div className="timeline">
                    {timeline.length > 0 ? (
                      timeline.map((t, i) => (
                        <div key={i} className="timeline-item">
                          <span className={`dot ${t.status || "placed"}`}></span>

                          <div>
                            <strong>{(t.status || "placed").toUpperCase()}</strong>
                            <small>
                              {t.created_at
                                ? new Date(t.created_at).toLocaleString()
                                : "Unknown date"}
                            </small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty">No timeline available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Orders;
