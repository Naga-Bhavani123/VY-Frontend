import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../NavBar/index.jsx";
import "./index.css";

function getUserFromToken() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  try {
    const [,payload64] = token.split(".");
    const baseString = atob(payload64); 
     const payload = JSON.parse(baseString);     // convert JSON string → object
    return payload;   
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

const AdminCreateEmployee = () => {
  const jwtToken = localStorage.getItem("jwt_token");
  const user = getUserFromToken();
  const role = user?.role;

  if (!jwtToken || role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // 👉 Separate state for each field
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [hra, setHra] = useState("");
  const [allowances, setAllowances] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  async function gettingOne (){
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    }
    const response = await fetch("https://vy-backend.onrender.com/employee/next-id", options);
     if (response.ok) {
        const data = await response.json()
        setEmployeeId(data.employeeId);
      }
  }
  

  
  useEffect (() => {
    gettingOne()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId || !employeeName || !officialEmail || !basicSalary || !hra || !allowances || ! isActive || !roleTitle || !contactNumber) {
      setMessage("Please fill all required fields (*)");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const bodyData = {
        employeeId,
        employeeName,
        officialEmail,
        roleTitle,
        contactNumber,
        basicSalary: Number(basicSalary),
        hra: hra ? Number(hra) : 0,
        allowances: allowances ? Number(allowances) : 0,
        isActive,
      };

      const res = await fetch("https://vy-backend.onrender.com/employee/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Failed to create employee");
        setMessageType("error");
        setTimeout(() => setMessage(""), 2500);
        return;
      }

      setMessage(data.msg || "Employee created successfully");
      setMessageType("success");

      // clear all fields after success
      setEmployeeId("");
      setEmployeeName("");
      setOfficialEmail("");
      setRoleTitle("");
      setContactNumber("");
      setBasicSalary("");
      setHra("");
      setAllowances("");
      setIsActive(true);

      setTimeout(() => setMessage(""), 2500);
      setTimeout(() => gettingOne(), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="emp-page">
        <div className="emp-card">
          <h2 className="emp-title">Create Employee</h2>
          <p className="emp-subtitle">
            Fill the details below to register a new VY employee in the system.
          </p>

          {message && (
            <div
              className={`emp-message-bar ${
                messageType === "success" ? "emp-success" : "emp-error"
              }`}
            >
              {message}
            </div>
          )}

          <form className="emp-form" onSubmit={handleSubmit}>
            <div className="emp-row">
              <div className="emp-field">
                <label>
                  Employee ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="employeeId"
                  placeholder="e.g. VY0005"
                  value={employeeId}
                  readOnly                  
                />
              </div>

              <div className="emp-field">
                <label>
                  Employee Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="employeeName"
                  placeholder="Full Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>
            </div>

            <div className="emp-row">
              <div className="emp-field">
                <label>
                  Official Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="officialEmail"
                  placeholder="name@vy.com"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                />
              </div>

              <div className="emp-field">
                <label>Role Title  <span className="required">*</span></label>
                <input
                  type="text"
                  name="roleTitle"
                  placeholder="Developer / HR / Admin"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="emp-row">
              <div className="emp-field">
                <label>Contact Number <span className="required">*</span></label> 
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="10 digit mobile"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <div className="emp-field">
                <label>
                  Basic Salary (per month) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  placeholder="e.g. 45000"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(e.target.value)}
                />
              </div>
            </div>

            <div className="emp-row">
              <div className="emp-field">
                <label>HRA <span className="required">*</span></label> 
                <input
                  type="number"
                  name="hra"
                  placeholder="e.g. 10000"
                  value={hra}
                  onChange={(e) => setHra(e.target.value)}
                />
              </div>

              <div className="emp-field">
                <label>Allowances <span className="required">*</span></label>
                <input
                  type="number"
                  name="allowances"
                  placeholder="e.g. 5000"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                />
              </div>
            </div>

            <div className="emp-row">
              <div className="emp-field-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Active Employee</span>
                </label>
              </div>
            </div>

            <button className="emp-submit-btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminCreateEmployee;
