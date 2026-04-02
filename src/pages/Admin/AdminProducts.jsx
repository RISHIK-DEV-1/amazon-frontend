import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminProducts.css";

function AdminProducts() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "", price: "", category: "", image: "", description: "", features: ""
  });

  const [editId, setEditId] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const fetchProducts = () => {
    fetch(`${BASE_URL}/products`)
      .then(res => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = () => {
    if (!form.title || !form.price) return alert("Title & price required");

    fetch(
      editId
        ? `${BASE_URL}/products/admin/products/${editId}`
        : `${BASE_URL}/products/admin/products`,
      {
        method: editId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(form)
      }
    )
      .then(res => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then(() => {
        showMessage(editId ? "Product updated" : "Product added");
        setForm({ title:"", price:"", category:"", image:"", description:"", features:"" });
        setEditId(null);
        fetchProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete product?")) return;

    fetch(`${BASE_URL}/products/admin/products/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    }).then(res => {
      if (res.status === 401) return logout();
      showMessage("Product deleted");
      fetchProducts();
    });
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title || "",
      price: p.price || "",
      category: p.category || "",
      image: p.image || "",
      description: p.description || "",
      features: p.features || ""
    });
    setEditId(p.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      title: "",
      price: "",
      category: "",
      image: "",
      description: "",
      features: ""
    });
    showMessage("Edit cancelled");
  };

  return (
    <div>
      <h2>📦 Products</h2>

      {message && <div className="success-msg">{message}</div>}

      <div className="admin-card">

        {Object.keys(form).map(key => (
          key === "category" ? (
            // ✅ DROPDOWN ADDED ONLY HERE
            <select
              key={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="deals">Deals</option>
              <option value="recommended">Recommended</option>
            </select>
          ) : (
            <input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          )
        ))}

        {/* BUTTON GROUP */}
        <div className="form-actions">
          <button onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>

      </div>

      <div className="admin-table">
        {products.length === 0 ? (
          <p className="empty-state">No products</p>
        ) : (
          products.map(p => (
            <div className="admin-row" key={p.id}>
              <img src={p.image} alt="" />

              <div className="admin-info">
                <strong>{p.title}</strong>
                <span>₹{p.price}</span>
                <small>{p.category}</small>
              </div>

              <div className="admin-actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
