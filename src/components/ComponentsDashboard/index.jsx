// src/components/Home/index.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Components = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null); // "ADMIN" | "EMPLOYEE" | null
  const jwtToken = localStorage.getItem("jwt_token");
  console.log("components")
  // Decode role from JWT
  useEffect(() => {
    if (!jwtToken) return;

    try {
      const payloadBase64 = jwtToken.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      // backend: jwt.sign({ employeeId, role: "ADMIN" | "EMPLOYEE" }, ...)
      setRole(payload.role || null);
      console.log("Decoded role:", payload.role);
    } catch (err) {
      console.error("Error decoding token:", err);
      setRole(null);
    }
  }, [jwtToken]);

  const isAdmin = role === "ADMIN";

  // Common cards for all employees
  const commonCards = [
    {
      id: 1,
      title: "Attendance",
      description: "Mark today’s attendance and view your attendance history.",
      icon: "🕒",
      onClick: () => navigate("/attendance"), // you can create /attendance page
    },
    {
      id: 2,
      title: "Compensation",
      description: "View monthly salary details and download payslips.",
      icon: "💰",
      onClick: () => navigate("/compensation"), // later
    },
    {
      id: 3,
      title: "HR Policies",
      description: "Read HR policies, company rules and guidelines.",
      icon: "📜",
      onClick: () => navigate("/policies"), // later
    },
    {
      id: 4,
      title: "Recruitment",
      description: "Track open positions and referral status.",
      icon: "👥",
      onClick: () => navigate("/recruitment"), // later
    },
  ];

  // Admin-only cards
  const adminCards = [
    {
      id: "a1",
      title: "Create Employee",
      description: "Add a new employee with salary, role and basic details.",
      icon: "➕",
      onClick: () => navigate("/admin/create-employee"),
    },
    {
      id: "a2",
      title: "All Employees",
      description: "View, search and manage all employees in the organisation.",
      icon: "📋",
      onClick: () => navigate("/admin/employees"),
    },
  ];

  return (
    
      <>
        <div className="vy-dashboard">
          
          {/* COMMON CARDS */}
          <section>
            <h2 className="vy-section-title">Employee Workspace</h2>
            <div className="vy-card-grid">
              {commonCards.map((card) => (
                <button
                  key={card.id}
                  className="vy-card"
                  type="button"
                  onClick={card.onClick}
                >
                  <div className="vy-card-icon">{card.icon}</div>
                  <h3 className="vy-card-title">{card.title}</h3>
                  <p className="vy-card-text">{card.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* ADMIN SECTION */}
          {isAdmin && (
            <section className="vy-admin-section">
              <h2 className="vy-section-title">Admin Tools</h2>
              <div className="vy-card-grid">
                {adminCards.map((card) => (
                  <button
                    key={card.id}
                    className="vy-card vy-card-admin"
                    type="button"
                    onClick={card.onClick}
                  >
                    <div className="vy-card-icon">{card.icon}</div>
                    <h3 className="vy-card-title">{card.title}</h3>
                    <p className="vy-card-text">{card.description}</p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
   
    </>
  );
};

export default Components;
