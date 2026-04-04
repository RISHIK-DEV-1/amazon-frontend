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
      .then((data) => {
        const grouped = {};

        (data || []).forEach((o) => {
          const key = o.invoice_id || o.id;

          if (!grouped[key]) {
            grouped[key] = {
              items: [],
              base: o,
            };
          }

          grouped[key].items.push(o);
        });

        // Sort latest orders first
        const groupedArray = Object.values(grouped).sort((a, b) => {
          const dateA = new Date(a.base.created_at || 0);
          const dateB = new Date(b.base.created_at || 0);
          return dateB - dateA;
        });

        setOrders(groupedArray);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleTimeline = (id) => {
    setOpenOrder(openOrder === id ? null : id);
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
        orders.map((group, index) => {
          const items = group.items;
          const o = group.base;
          const status = o.status || "placed";
          const timeline = Array.isArray(o.timeline) ? o.timeline : [];

          let addr = {};
          try {
            addr = JSON.parse(o.address || "{}");
          } catch {}

          return (
            <div className="order-card" key={o.invoice_id || index}>
              {/* MULTIPLE PRODUCT IMAGES */}
              <div className="order-images" style={{ display: "flex", gap: "6px" }}>
                {items.map((p, i) => (
                  <img
                    key={i}
                    src={p.image || "/placeholder.png"}
                    alt={p.title || "Product"}
                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                  />
                ))}
              </div>

              <div className="order-info">
                <strong>{items.length} item{items.length > 1 ? "s" : ""}</strong>
                <span>
                  ₹
                  {items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                </span>
                <span className={`status ${status}`}>{status.toUpperCase()}</span>
                <small>
                  {o.created_at
                    ? new Date(o.created_at).toLocaleString()
                    : "Unknown date"}
                </small>

                <p>
                  <b>Delivery:</b>{" "}
                  {addr.city ? `${addr.city} - ${addr.pincode}` : "Not Provided"}
                </p>

                <p>
                  <b>Payment Mode:</b> {o.payment_mode || "Not Provided"}
                </p>

                <div className="order-actions">
                  <button onClick={() => toggleTimeline(o.invoice_id)}>
                    {openOrder === o.invoice_id ? "Hide Timeline" : "View Timeline"}
                  </button>

                  {status !== "delivered" && status !== "cancelled" && (
                    <button
                      className="cancel-btn"
                      onClick={() => cancelOrder(o.id)}
                    >
                      Cancel
                    </button>
                  )}

                  <button onClick={() => navigate(`/invoice/${o.invoice_id}`)}>
                    View Invoice
                  </button>
                </div>

                {/* SINGLE TIMELINE FOR ALL PRODUCTS */}
                {openOrder === o.invoice_id && (
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
