import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../NavBar/index.jsx";
import "./index.css";

function getUserFromToken() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  try {
    const [, payload64] = token.split(".");
    const json = atob(payload64);
    return JSON.parse(json);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

const AdminEmployeesList = () => {
  const jwtToken = localStorage.getItem("jwt_token");
  const user = getUserFromToken();
  const role = user?.role;

  if (!jwtToken || role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // fetch all employees when page loads
  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const res = await fetch("https://vy-backend.onrender.com/employee/all", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEmployees(data.employees || []);
          setFiltered(data.employees || []);
        } else {
          setMessage(data.msg || "Failed to fetch employees");
          setMessageType("error");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong while fetching employees");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  // client-side search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(employees);
      return;
    }

    const lower = search.toLowerCase();
    const result = employees.filter((emp) => {
      return (
        emp.employeeId.toLowerCase().includes(lower) ||
        emp.employeeName.toLowerCase().includes(lower) ||
        (emp.officialEmail || "").toLowerCase().includes(lower) ||
        (emp.roleTitle || "").toLowerCase().includes(lower)
      );
    });
    setFiltered(result);
  }, [search, employees]);

  const openEdit = (emp) => {
    setSelectedEmployee({ ...emp }); // copy
    setMessage("");
  };

  const closeEdit = () => {
    setSelectedEmployee(null);
  };

  const handleEditChange = (field, value) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      setSaving(true);
      setMessage("");

      const empId = selectedEmployee.employeeId;

      const res = await fetch(`https://vy-backend.onrender.com/employee/${empId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          employeeName: selectedEmployee.employeeName,
          officialEmail: selectedEmployee.officialEmail,
          roleTitle: selectedEmployee.roleTitle,
          contactNumber: selectedEmployee.contactNumber,
          basicSalary: Number(selectedEmployee.basicSalary),
          hra: Number(selectedEmployee.hra || 0),
          allowances: Number(selectedEmployee.allowances || 0),
          isActive: selectedEmployee.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.msg || "Failed to update employee");
        setMessageType("error");
        return;
      }

      setMessage(data.msg || "Employee updated successfully");
      setMessageType("success");

      // update list in state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeId === empId ? { ...emp, ...selectedEmployee } : emp
        )
      );
      setFiltered((prev) =>
        prev.map((emp) =>
          emp.employeeId === empId ? { ...emp, ...selectedEmployee } : emp
        )
      );
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while updating employee");
      setMessageType("error");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <>
      <Navbar />
      <div className="emp-list-page">
        <div className="emp-list-top">
          <h2 className="emp-list-title">All Employees</h2>
          <input
            className="emp-search-input"
            type="text"
            placeholder="Search by ID, name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {message && (
          <div
            className={`emp-message-bar ${
              messageType === "success" ? "emp-success" : "emp-error"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="emp-list-loader">Loading employees...</div>
        ) : filtered.length === 0 ? (
          <p className="emp-empty-text">No employees found.</p>
        ) : (
          <div className="emp-cards-grid">
            {filtered.map((emp) => (
              <div key={emp._id} className="emp-card-item">
                <div className="emp-card-header">
                  <span className="emp-card-id">{emp.employeeId}</span>
                  <span
                    className={`emp-status-badge ${
                      emp.isActive ? "active" : "inactive"
                    }`}
                  >
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="emp-card-body">
                  <p className="emp-card-name">{emp.employeeName}</p>
                  <p className="emp-card-role">{emp.roleTitle || "—"}</p>
                  <p className="emp-card-email">{emp.officialEmail}</p>
                </div>
                <button
                  className="emp-edit-btn"
                  onClick={() => openEdit(emp)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Edit panel */}
        {selectedEmployee && (
          <div className="emp-edit-panel">
            <div className="emp-edit-card">
              <div className="emp-edit-header">
                <h3>Edit Employee - {selectedEmployee.employeeId}</h3>
                <button
                  type="button"
                  className="emp-edit-close"
                  onClick={closeEdit}
                >
                  ×
                </button>
              </div>

              <form className="emp-edit-form" onSubmit={handleUpdate}>
                <div className="emp-row">
                  <div className="emp-field">
                    <label>Employee Name</label>
                    <input
                      type="text"
                      value={selectedEmployee.employeeName || ""}
                      onChange={(e) =>
                        handleEditChange("employeeName", e.target.value)
                      }
                    />
                  </div>

                  <div className="emp-field">
                    <label>Official Email</label>
                    <input
                      type="email"
                      value={selectedEmployee.officialEmail || ""}
                      onChange={(e) =>
                        handleEditChange("officialEmail", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="emp-row">
                  <div className="emp-field">
                    <label>Role Title</label>
                    <input
                      type="text"
                      value={selectedEmployee.roleTitle || ""}
                      onChange={(e) =>
                        handleEditChange("roleTitle", e.target.value)
                      }
                    />
                  </div>

                  <div className="emp-field">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      value={selectedEmployee.contactNumber || ""}
                      onChange={(e) =>
                        handleEditChange("contactNumber", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="emp-row">
                  <div className="emp-field">
                    <label>Basic Salary</label>
                    <input
                      type="number"
                      value={selectedEmployee.basicSalary || ""}
                      onChange={(e) =>
                        handleEditChange("basicSalary", e.target.value)
                      }
                    />
                  </div>

                  <div className="emp-field">
                    <label>HRA</label>
                    <input
                      type="number"
                      value={selectedEmployee.hra || ""}
                      onChange={(e) =>
                        handleEditChange("hra", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="emp-row">
                  <div className="emp-field">
                    <label>Allowances</label>
                    <input
                      type="number"
                      value={selectedEmployee.allowances || ""}
                      onChange={(e) =>
                        handleEditChange("allowances", e.target.value)
                      }
                    />
                  </div>

                  <div className="emp-field-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!selectedEmployee.isActive}
                        onChange={(e) =>
                          handleEditChange("isActive", e.target.checked)
                        }
                      />
                      <span>Active Employee</span>
                    </label>
                  </div>
                </div>

                <button
                  className="emp-submit-btn"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminEmployeesList;
