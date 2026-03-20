import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login, BASE_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  // LOGIN / CREATE ACCOUNT
  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (createAccount && !name) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          name: createAccount ? name : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Authentication failed");
        return;
      }

      // Save user + token
      login(data);

      // Amazongo popup
      window.alert(`amazongo says:\n\nWelcome ${data.user?.name}`);

      // Redirect to home
      navigate("/");

    } catch (err) {
      setError("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    if (!email || !newPassword) {
      setError("Enter email and new password");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          new_password: newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail);
        return;
      }

      window.alert("amazongo says:\n\nPassword updated successfully");

      setForgotMode(false);
      setNewPassword("");

    } catch {
      setError("Backend connection failed");
    }
  };

  return (
    <div className="login-page">

      <img
        className="login-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        alt="Amazon"
      />

      <div className="login-box">

        <h2>
          {forgotMode
            ? "Reset Password"
            : createAccount
            ? "Create account"
            : "Sign in"}
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!forgotMode && (
          <>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {forgotMode && (
          <>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}

        {createAccount && !forgotMode && (
          <>
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        {!forgotMode ? (
          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Processing..."
              : createAccount
              ? "Create Account"
              : "Login"}
          </button>
        ) : (
          <button onClick={handleResetPassword}>
            Reset Password
          </button>
        )}

        {!createAccount && !forgotMode && (
          <p
            style={{ color: "#007185", cursor: "pointer" }}
            onClick={() => setForgotMode(true)}
          >
            Forgot Password?
          </p>
        )}

        {forgotMode && (
          <p
            style={{ color: "#007185", cursor: "pointer" }}
            onClick={() => setForgotMode(false)}
          >
            Back to Login
          </p>
        )}

        {!forgotMode && (
          <p style={{ marginTop: "10px" }}>
            {!createAccount ? (
              <>
                New to Amazon?{" "}
                <span
                  style={{ color: "#007185", cursor: "pointer" }}
                  onClick={() => setCreateAccount(true)}
                >
                  Create account
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  style={{ color: "#007185", cursor: "pointer" }}
                  onClick={() => setCreateAccount(false)}
                >
                  Sign in
                </span>
              </>
            )}
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;
