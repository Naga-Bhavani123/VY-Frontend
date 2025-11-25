import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./index.css";

function LoginPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeId.trim() || !password) {
      setMessage("Please enter Employee ID & Password");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      setLoading(true);
      console.log(password)
      const res = await fetch("https://vy-backend.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });
     
      const data = await res.json();

      if (!res.ok) {
        console.lo
        setMessage(data.msg || "Invalid credentials");
        setMessageType("error");
        setTimeout(() => setMessage(""), 2000);
        return;
      }
      localStorage.setItem("jwt_token", data.token)
      setMessage("Login successful!");
      setMessageType("success");
      setTimeout(() => {
        navigate("/dashboard"); // redirect after login
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
    if (localStorage.getItem("jwt_token") != undefined) return <Navigate to = "/dashboard" />


  return (
    <div className="vy-auth-wrapper">
      {/* LEFT SIDE */}
      <div className="vy-auth-left">
        <div className="vy-auth-left-content" style={{ textAlign: "center" }}>
          <div className="vy-logo-bounce">
            <div className="vy-logo-circle">
              <span className="vy-logo-text">VY</span>
            </div>
          </div>

          <p className="vy-left-subtitle" style={{ fontWeight: "700", fontSize: "30px" }}>
            Before Login — You must Register first.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – LOGIN FORM */}
      <div className="vy-auth-right">
        <div className="vy-register-card">
          <h2 className="vy-right-title">Login to VY</h2>
          <p className="vy-right-subtitle">Enter your Employee ID & Password</p>

          {message && (
            <div
              className={`vy-message-bar ${
                messageType === "success"
                  ? "vy-message-success"
                  : "vy-message-error"
              }`}
            >
              {message}
            </div>
          )}

          <form className="vy-register-form" onSubmit={handleLogin}>
            <div className="vy-form-group">
              <label htmlFor="employeeId">Employee ID</label>
              <input
                id="employeeId"
                type="text"
                placeholder="e.g. VY001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            <div className="vy-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="vy-register-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="vy-right-login-text">
            Don't have an account?{" "}
            <button
              type="button"
              className="vy-inline-link"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
