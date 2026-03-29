import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Address.css";

function Address() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchAddress = () => {
    setLoading(true);
    fetch(`${BASE_URL}/address`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error("Failed to fetch address");
        return res.json();
      })
      .then((data) => setSaved(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const saveAddress = () => {
    if (!address.trim() || !pincode.trim()) {
      alert("Enter address & pincode");
      return;
    }

    fetch(`${BASE_URL}/address`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ address, pincode }),
    })
      .then((res) => {
        if (res.status === 401) return logout();
        if (!res.ok) throw new Error("Failed to save address");
        return res.json();
      })
      .then(() => {
        setMessage("Address saved successfully!");
        fetchAddress();
        setAddress("");
        setPincode("");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || "Failed to save address");
      });
  };

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>

      <div className="form-group">
        <label>Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
        />
      </div>

      <div className="form-group">
        <label>Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />
      </div>

      <button className="save-btn" onClick={saveAddress}>
        Save Address
      </button>

      {message && <p className="success-message">{message}</p>}

      {loading ? (
        <p>Loading saved address...</p>
      ) : saved?.address ? (
        <div className="saved-address">
          <h4>Saved Address:</h4>
          <p>
            <strong>Address:</strong> {saved.address}
          </p>
          <p>
            <strong>Pincode:</strong> {saved.pincode}
          </p>
        </div>
      ) : (
        <p>No saved address yet</p>
      )}
    </div>
  );
}

export default Address;
