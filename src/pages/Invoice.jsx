import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Invoice.css";

function Invoice() {
  const { invoice_id } = useParams();
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/invoice/${invoice_id}`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error("Failed to fetch invoice");
        return res.json();
      })
      .then((data) => {
        if (!data.products || !Array.isArray(data.products)) data.products = [];
        setInvoice(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [invoice_id, BASE_URL, authHeaders, logout]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 20 }}>Loading invoice...</p>;
  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: 20, color: "red" }}>{error}</p>
    );

  return (
    <div className="invoice-page">
      <h2>Invoice #{invoice.id}</h2>
      <p><strong>Order ID:</strong> {invoice.order_id}</p>
      <p><strong>Placed by:</strong> {invoice.username || "N/A"}</p>
      <p><strong>Total Amount:</strong> ₹{invoice.total_amount ?? "N/A"}</p>
      <p><strong>Payment Mode:</strong> {invoice.payment_mode || "N/A"}</p>
      <p><strong>Created At:</strong> {invoice.created_at ? new Date(invoice.created_at).toLocaleString() : "Unknown"}</p>

      <h3>Delivery Address</h3>
      <p>
        {invoice.address?.trim() || "N/A"}, {invoice.pincode?.trim() || "N/A"}
      </p>

      <h3>Products</h3>
      {invoice.products.length > 0 ? (
        <table className="invoice-products">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((p, i) => (
              <tr key={i}>
                <td>{p.title || "N/A"}</td>
                <td>₹{p.price ?? 0}</td>
                <td>{p.quantity ?? 0}</td>
                <td>₹{(p.price ?? 0) * (p.quantity ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found</p>
      )}

      <button onClick={() => window.print()} className="print-btn">
        Print Invoice
      </button>
    </div>
  );
}

export default Invoice;
