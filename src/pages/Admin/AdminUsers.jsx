import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./AdminUsers.css";

function AdminUsers() {
  const { BASE_URL, authHeaders, logout } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const fetchUsers = () => {
    fetch(`${BASE_URL}/admin/users`, { headers: authHeaders() })
      .then(res => {
        if (res.status === 401) return logout();
        return res.json();
      })
      .then(setUsers);
  };

  useEffect(() => fetchUsers(), []);

  const makeAdmin = (id) => {
    fetch(`${BASE_URL}/admin/users/${id}/make-admin`, {
      method: "PUT",
      headers: authHeaders()
    }).then(() => {
      showMessage("Promoted to admin");
      fetchUsers();
    });
  };

  const removeAdmin = (id) => {
    fetch(`${BASE_URL}/admin/users/${id}/remove-admin`, {
      method: "PUT",
      headers: authHeaders()
    }).then(() => {
      showMessage("Admin removed");
      fetchUsers();
    });
  };

  const deleteUser = (id) => {
    fetch(`${BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: authHeaders()
    }).then(() => {
      showMessage("User deleted");
      fetchUsers();
    });
  };

  return (
    <div>
      <h2>👤 Users</h2>

      {message && <div className="success-msg">{message}</div>}

      <div className="admin-table">
        {users.map(u => (
          <div className="admin-row" key={u.id}>
            <span>{u.name}</span>
            <span>{u.email}</span>
            <span>{u.role}</span>

            <div className="admin-actions">
              {u.role === "user" ? (
                <button className="edit-btn" onClick={() => makeAdmin(u.id)}>Make Admin</button>
              ) : (
                <button className="edit-btn" onClick={() => removeAdmin(u.id)}>Remove Admin</button>
              )}
              <button className="delete-btn" onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsers;
