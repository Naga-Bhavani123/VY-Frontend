import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function RegisterPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const [showLoginCTA, setShowLoginCTA] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedId = employeeId.trim();
    const trimmedEmail = employeeEmail.trim();

    if (!trimmedId || !trimmedEmail || !password) {
      setMessage("Please fill all fields!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      setLoading(true);
      setShowLoginCTA(false);
      setMessage("");

      const res = await fetch("https://vy-backend.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: trimmedId,
          employeeEmail: trimmedEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg =
          typeof data === "string" ? data : data.msg || "Registration failed";
        setMessage(errorMsg);
        setMessageType("error");
        setTimeout(() => setMessage(""), 2000);
        return;
      }

      // success – backend sends msg key
      const successMsg =
        typeof data === "string" ? data : data.msg || "Registered successfully!";
      setMessage(successMsg);
      setMessageType("success");

      // hide message after 2 seconds
      setTimeout(() => setMessage(""), 2000);

      // after 2.5 seconds, show Login CTA with arrow
      setTimeout(() => setShowLoginCTA(true), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vy-auth-wrapper">
      {/* LEFT SIDE: Logo + purpose */}
      <div className="vy-auth-left">
        <div className="vy-auth-left-content">
          <div className="vy-logo-bounce">
            <div className="vy-logo-circle">
              <span className="vy-logo-text">VY</span>
            </div>
          </div>

          <h1 className="vy-left-title">VY Payroll Suite</h1>
          <p className="vy-left-subtitle">
            A secure payroll & attendance portal for VY employees. Track your
            time, view your payslips, and keep your profile up to date.
          </p>

          <ul className="vy-left-list">
            <li>• Mark daily clock-in and clock-out with one click.</li>
            <li>• View monthly salary details and payslips.</li>
            <li>• Maintain your employee profile and contact details.</li>
          </ul>

          <div className="vy-left-note">
            <p>
              <strong>Registration rule:</strong> You must already be an{" "}
              <span>employee of VY</span> to register here.
            </p>
            <p>
              If you don&apos;t have an Employee ID, please meet your{" "}
              <strong>Admin</strong> to get added first.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Register form */}
      <div className="vy-auth-right">
        <div className="vy-register-card">
          <h2 className="vy-right-title">Create your VY account</h2>
          <p className="vy-right-subtitle">
            Use your official VY Employee ID and email to get started.
          </p>

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

          <form className="vy-register-form" onSubmit={handleRegister}>
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
              <label htmlFor="employeeEmail">Employee Email</label>
              <input
                id="employeeEmail"
                type="email"
                placeholder="company email"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
              />
            </div>

            <div className="vy-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="vy-register-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="vy-btn-loader">
                  <span className="vy-spinner" />
                  Registering…
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="vy-right-login-text">
            Already registered?{" "}
            <button
              type="button"
              className="vy-inline-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>

          {showLoginCTA && (
            <button
              type="button"
              className="vy-login-cta"
              onClick={() => navigate("/login")}
            >
              <span>Go to Login</span>
              <span className="vy-login-arrow">➜</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
