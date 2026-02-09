import { useState, useEffect } from "react";
import "./Address.css";

function Address() {
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [savedPincode, setSavedPincode] = useState("");

  useEffect(() => {
    const a = localStorage.getItem("deliveryAddress");
    const p = localStorage.getItem("deliveryPincode");
    if (a) setSavedAddress(a);
    if (p) setSavedPincode(p);
  }, []);

  const saveAddress = () => {
    if (!address || !pincode) return;

    localStorage.setItem("deliveryAddress", address);
    localStorage.setItem("deliveryPincode", pincode);

    setSavedAddress(address);
    setSavedPincode(pincode);

    setAddress("");
    setPincode("");
  };

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>

      <textarea
        placeholder="Enter your full delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="text"
        placeholder="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />

      <button onClick={saveAddress}>Save Address</button>

      {savedAddress && (
        <div className="saved-address">
          <h4>Saved Address</h4>
          <pre>{savedAddress}</pre>
          <strong>Pincode: {savedPincode}</strong>
        </div>
      )}
    </div>
  );
}

export default Address;
