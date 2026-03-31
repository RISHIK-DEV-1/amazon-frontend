import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Address.css";

function Address() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const hasPrefilled = useRef(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchAddress = () => {
    setLoading(true);

    fetch(`${BASE_URL}/address`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then((data) => {
        if (data?.address) {
          try {
            const parsed = JSON.parse(data.address);
            setSaved(parsed);

            if (!hasPrefilled.current) {
              setForm(parsed);
              hasPrefilled.current = true;
            }
          } catch {
            setSaved(null);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const saveAddress = () => {
    if (!form.name || !form.house || !form.city || !form.pincode) {
      alert("Fill required fields");
      return;
    }

    fetch(`${BASE_URL}/address`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        address: JSON.stringify(form),
        pincode: form.pincode,
      }),
    })
      .then(() => {
        setMessage("Address saved successfully!");
        fetchAddress();
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => alert("Failed to save address"));
  };

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>

      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
      <input name="house" placeholder="House / Flat" value={form.house} onChange={handleChange} />
      <input name="area" placeholder="Area / Street" value={form.area} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
      <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />

      <button className="save-btn" onClick={saveAddress}>
        Save Address
      </button>

      {message && <p className="success-message">{message}</p>}

      {loading ? (
        <p>Loading saved address...</p>
      ) : saved ? (
        <div className="saved-address">
          <h4>Saved Address:</h4>
          <p>{saved.name}</p>
          <p>{saved.house}, {saved.area}</p>
          <p>{saved.city}, {saved.state} - {saved.pincode}</p>
          <p>Phone: {saved.phone}</p>
        </div>
      ) : (
        <p>No saved address yet</p>
      )}
    </div>
  );
}

export default Address;
