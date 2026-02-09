import { useState, useContext } from "react";
import "./Login.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const [step, setStep] = useState("password"); // password | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [name, setName] = useState("");

  const handlePasswordSubmit = () => {
    if (!email || !password) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setStep("otp");
  };

  const handleOtpSubmit = () => {
    if (otp === generatedOtp) {
      login({ email, name: name || "Amazon Customer" });
    } else {
      alert("Invalid OTP");
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
        {step === "password" && (
          <>
            <h2>Sign in</h2>

            <label>Email or mobile phone number</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Your Name (optional)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handlePasswordSubmit}>
              Continue
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2>Authentication required</h2>

            <p className="otp-info">OTP sent to your device</p>

            <div className="otp-box">
              OTP: <strong>{generatedOtp}</strong>
            </div>

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={handleOtpSubmit}>
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
