import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminHistory.css";

function AdminHistory() {
  const { BASE_URL, authHeaders } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/admin/history`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteHistory = async (id) => {
    if (!window.confirm("Delete this history item?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/history/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete history item");
      fetchHistory();
    } catch (err) {
      alert(err.message || "Failed to delete history");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Clear ALL history?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/history`, {
        method: "DELETE",
        headers: authHeaders()
      });
      if (!res.ok) throw new Error("Failed to clear history");
      fetchHistory();
    } catch (err) {
      alert(err.message || "Failed to clear history");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 20 }}>Loading history...</p>;

  return (
    <div>
      <h2>📜 History</h2>
      <button className="delete-btn" onClick={clearAll} disabled={loading}>
        Clear All History
      </button>
      {error && <p className="error-text">{error}</p>}

      <div className="admin-table">
        {history.length === 0 ? (
          <p className="empty-state">No history found</p>
        ) : (
          history.map((item) => (
            <div className="admin-row" key={item.id}>
              <span>{item.username}</span>
              <span>
                {item.product_title} <br />₹{item.product_price}
              </span>
              <span>{item.product_category}</span>
              <span>{new Date(item.viewed_at).toLocaleString()}</span>
              <span>
                <button className="delete-btn" onClick={() => deleteHistory(item.id)}>
                  Delete
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminHistory;
