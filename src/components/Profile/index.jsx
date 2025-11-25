import { useEffect, useState } from "react";
import Navbar from "../NavBar";
import "./index.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("https://vy-backend.onrender.com/employee/profile", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Failed to load profile");
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />

      <div className="profile-page">
        {loading && <div className="profile-loader">Loading profile…</div>}

        {!loading && error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {!loading && profile && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={profile.name}
                  />
                ) : (
                  <span>
                    {profile.name
                      ?.split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-role">
                  {profile.roleTitle || "Employee"} · {profile.role}
                </p>
                <p className="profile-id">Employee ID: {profile.employeeId}</p>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="profile-field">
                <label>Official Email</label>
                <p>{profile.officialEmail}</p>
              </div>
              <div className="profile-field">
                <label>Contact Number</label>
                <p>{profile.contactNumber || "-"}</p>
              </div>
              <div className="profile-field">
                <label>Basic Salary</label>
                <p>₹ {profile.basicSalary}</p>
              </div>
              <div className="profile-field">
                <label>HRA</label>
                <p>₹ {profile.hra}</p>
              </div>
              <div className="profile-field">
                <label>Allowances</label>
                <p>₹ {profile.allowances}</p>
              </div>
              <div className="profile-field">
                <label>Status</label>
                <p>{profile.isActive ? "Active" : "Inactive"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
