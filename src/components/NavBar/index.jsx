import { useNavigate , Navigate, Link} from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

function Navbar() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [timeDate, setTimeDate] = useState(new Date().toLocaleString());
  const [profilePhoto, setProfilePhoto] = useState("");

  const jwt = localStorage.getItem("jwt_token");
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  useEffect(() => {
      const fetching = async () => {
        const response = await fetch("https://vy-backend.onrender.com/employee/profils", {
          headers:{
            Authorization
          }
        })
      }
  }, [])

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  useEffect(() => {
    const id = setInterval(
      () => setTimeDate(new Date().toLocaleString()),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const notifications = [
    "💰 Salary for this month will be credited on 10th.",
    "📍 Please update your current address in your profile.",
    "📑 Once check the company Acts & policies in the HR section.",
  ];


  return (
    <>
      <nav className="vy-navbar">
        {/* LEFT */}
        <div className="vy-nav-left">
            <Link to = "/">
          <div className="vy-nav-logo-circle">
            <span className="vy-nav-logo-text">VY</span>
          </div>
          </Link>
        </div>

        {/* CENTER TOP BAR (DESKTOP) */}
        <div className="vy-top-bar">
          <span>👋 Welcome, Employee</span>
          <span>{timeDate}</span>
        </div>

        {/* RIGHT (DESKTOP) */}
        <div className="vy-nav-right">
          {/* Notification bell */}
          <div className="vy-notification-wrapper">
            <button
              type="button"
              className="vy-notification-icon"
              onClick={toggleNotifications}
              title="Notifications"
            >
              🔔
            </button>

            {showNotifications && (
              <div className="vy-notification-panel">
                <div className="vy-notification-header">
                  <span>Notifications</span>
                  <button
                    type="button"
                    className="vy-notification-close"
                    onClick={() => setShowNotifications(false)}
                  >
                    ×
                  </button>
                </div>
                <ul className="vy-notification-list">
                  {notifications.map((note, index) => (
                    <li key={index} className="vy-notification-item">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <div
            className="vy-profile-icon"
            onClick={() => navigate("/profile")}
            title="Profile"
          >
            {profilePhoto? <img src = {profilePhoto}/>:<div>👤</div>}
          </div>

          {/* Logout */}
          <button className="vy-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* HAMBURGER ICON (MOBILE) */}
        <button
          className="vy-hamburger"
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <span className="vy-hamburger-line" />
          <span className="vy-hamburger-line" />
          <span className="vy-hamburger-line" />
        </button>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {showMobileMenu && (
        <div className="vy-mobile-menu">
          <div className="vy-mobile-header">
            <span>👋 Welcome, Employee </span> {" "}
            <span>{" "}{timeDate}</span>
          </div>

          <button
            type="button"
            className="vy-mobile-item"
            onClick={toggleNotifications}
          >
            🔔 Notifications
          </button>

          {/* If they open notifications from mobile, show list below */}
          {showNotifications && (
            <div className="vy-mobile-notifications">
              <ul className="vy-notification-list">
                {notifications.map((note, index) => (
                  <li key={index} className="vy-notification-item">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            className="vy-mobile-item"
            onClick={() => {
              setShowMobileMenu(false);
              navigate("/profile");
            }}
          >
            👤 Profile
          </button>

          <button
            type="button"
            className="vy-mobile-item"
            onClick={() => {
              setShowMobileMenu(false);
              handleLogout();
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;
