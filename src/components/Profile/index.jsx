// src/components/ProfilePage/index.jsx
import { useEffect, useState } from "react";
import Navbar from "../NavBar";
import "./index.css";

const BASE_URL = "https://vy-backend.onrender.com";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // editable fields
  const [contactNumber, setContactNumber] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState(null); // file from browser

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`${BASE_URL}/employee/profile`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });


        const data = await res.json();
        

        if (!res.ok) {
          setError(data.msg || "Failed to load profile");
        } else {
          setProfile(data);
          console.log(data.profilePhotoUrl
)
          setContactNumber(data.contactNumber || "");
          setProfilePhotoUrl(data.profilePhotoUrl || "");
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

  const handlePhotoClick = () => {
    const input = document.getElementById("vy-photo-input");
    if (input) input.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    console.log(file)

    if (!file) return;

    setProfilePhotoFile(file);

    // show preview immediately
    const previewUrl = URL.createObjectURL(file);
    console.log(previewUrl)
    setProfilePhotoUrl(previewUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken) {
      setError("Please login again to update profile.");
      return;
    }

    try {
      setSaving(true);

      let finalPhotoUrl = profilePhotoUrl;

      // 1️⃣ if a new file is selected, upload it
      if (profilePhotoFile) {
        const formData = new FormData();
        formData.append("photo", profilePhotoFile);
        console.log(formData)

        const uploadRes = await fetch(
          `${BASE_URL}/employee/profile/photo`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setError(uploadData.msg || "Failed to upload photo");
          setSaving(false);
          return;
        }

         const backendPath = uploadData.profilePhotoUrl;

  finalPhotoUrl = backendPath.startsWith("http")
    ? backendPath
    : `${BASE_URL}${backendPath}`;

        
      }

      // 2️⃣ update other profile info (contact number, and also save url in doc)
      const res = await fetch(`${BASE_URL}/employee/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          contactNumber,
          profilePhotoUrl: finalPhotoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Failed to update profile");
        setSaving(false);
        return;
      }

      setSuccess(data.msg || "Profile updated successfully");
      setProfile((prev) => ({
        ...prev,
        contactNumber,
        profilePhotoUrl: finalPhotoUrl,
      }));

      // remove success after few seconds
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="vy-profile-page">
        {loading && <div className="vy-profile-loader">Loading profile…</div>}


        {!loading && profile && (
          <div className="vy-profile-card">
            <div className="vy-profile-header">
              {/* Avatar clickable */}
             <div className="vy-profile-avatar-wrapper" onClick={handlePhotoClick}>
  <div className="vy-profile-avatar">
    {console.log(profilePhotoUrl)}
    {profilePhotoUrl ? (
      <img src={profilePhotoUrl} alt="Profile" />
    ) : (
      <div className="vy-upload-placeholder">
        📷 Upload Photo
      </div>
    )}
  </div>

  {/* Hidden file input */}
  <input
    id="vy-photo-input"
    type="file"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handlePhotoChange}
  />

  {/* Hover overlay only when photo exists */}
  {profilePhotoUrl && (
    <div className="vy-profile-avatar-overlay">
      <span className="vy-upload-btn">📷 Change Photo</span>
    </div>
  )}
</div>


             

              <div className="vy-profile-main-info">
                <h2 className="vy-profile-name">
                  {profile.employeeName || "Employee"}
                </h2>
                <p className="vy-profile-role">
                  {profile.roleTitle || "Employee"} ·{" "}
                  {profile.isActive ? "Active" : "Inactive"}
                </p>
                <p className="vy-profile-id">
                  Employee ID: <span>{profile.employeeId}</span>
                </p>
              </div>
            </div>

            {(success || error) && (
              <div
                className={`vy-profile-message ${
                  success ? "vy-profile-success" : "vy-profile-error"
                }`}
              >
                {success || error}
              </div>
            )}

            <form className="vy-profile-form" onSubmit={handleUpdate}>
              <div className="vy-profile-grid">
                <div className="vy-profile-field">
                  <label>Official Email</label>
                  <input
                    type="email"
                    value={profile.officialEmail}
                    readOnly
                    className="vy-readonly-input"
                  />
                </div>

                <div className="vy-profile-field">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className="vy-profile-field">
                  <label>Basic Salary</label>
                  <input
                    type="text"
                    value={`₹ ${profile.basicSalary}`}
                    readOnly
                    className="vy-readonly-input"
                  />
                </div>

                <div className="vy-profile-field">
                  <label>HRA</label>
                  <input
                    type="text"
                    value={`₹ ${profile.hra}`}
                    readOnly
                    className="vy-readonly-input"
                  />
                </div>

                <div className="vy-profile-field">
                  <label>Allowances</label>
                  <input
                    type="text"
                    value={`₹ ${profile.allowances}`}
                    readOnly
                    className="vy-readonly-input"
                  />
                </div>

                <div className="vy-profile-field">
                  <label>Status</label>
                  <input
                    type="text"
                    value={profile.isActive ? "Active" : "Inactive"}
                    readOnly
                    className="vy-readonly-input"
                  />
                </div>
              </div>

              <div className="vy-profile-actions">
                <button
                  type="submit"
                  className="vy-profile-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
