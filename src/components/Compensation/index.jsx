import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../NavBar/index.jsx";
import "./index.css";

const Compensation = () => {
  const jwtToken = localStorage.getItem("jwt_token");

  // if not logged in → back to login
  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-12

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // create year dropdown options (last 3, current, next 1)
  const yearOptions = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y++) {
    yearOptions.push(y);
  }

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const fetchCompensation = async () => {
    try {
      setLoading(true);
      setMessage("");

      const url = `https://vy-backend.onrender.com/employee/compensation/month?year=${year}&month=${month}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        setData(null);
        setMessage(json.msg || "Failed to fetch compensation details");
        setMessageType("error");
        return;
      }

      setData(json);
    } catch (err) {
      console.error(err);
      setData(null);
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
      if (message) {
        setTimeout(() => setMessage(""), 2500);
      }
    }
  };

  useEffect(() => {
    fetchCompensation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const handleDownloadPayslip = async () => {
    try {
      setDownloading(true);
      setMessage("");

      const url = `https://vy-backend.onrender.com/employee/compensation/payslip/pdf?year=${year}&month=${month}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) {
        const json = await res.json();
        setMessage(json.msg || "Failed to download payslip");
        setMessageType("error");
        setTimeout(() => setMessage(""), 2500);
        return;
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const monthLabel =
        monthOptions.find((m) => m.value === Number(month))?.label || month;
      a.href = downloadUrl;
      a.download = `VY_Payslip_${year}_${monthLabel}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("Payslip downloaded successfully");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while downloading payslip");
      setMessageType("error");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="comp-page">
        <div className="comp-header">
          <div>
            <h2 className="comp-title">Compensation</h2>
            <p className="comp-subtitle">
              View your monthly salary breakup and download your payslip.
            </p>
          </div>

          <div className="comp-filters">
            <div className="comp-filter-field">
              <label>Year</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="comp-filter-field">
              <label>Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`comp-message-bar ${
              messageType === "success"
                ? "comp-message-success"
                : "comp-message-error"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="comp-loader">Loading compensation...</div>
        ) : !data ? (
          <p className="comp-empty-text">
            No data available for selected month and year.
          </p>
        ) : (
          <>
            {/* TOP CARDS */}
            <div className="comp-cards-row">
              <div className="comp-card">
                <h3 className="comp-card-title">Monthly Earnings</h3>
                <p className="comp-card-value">₹{data.grossMonthly}</p>
                <p className="comp-card-note">
                  Basic: ₹{data.basicSalary} • HRA: ₹{data.hra} • Allowances: ₹
                  {data.allowances}
                </p>
              </div>

              <div className="comp-card">
                <h3 className="comp-card-title">Net Pay</h3>
                <p className="comp-card-value">₹{data.netPay}</p>
                <p className="comp-card-note">
                  Earnings for present days: ₹{data.earningsForPresentDays}
                </p>
              </div>

              <div className="comp-card">
                <h3 className="comp-card-title">Attendance</h3>
                <p className="comp-card-value">
                  {data.presentDays}/{data.workingDays} days
                </p>
                <p className="comp-card-note">
                  Absent: {data.absentDays} • Per day: ₹{data.perDay}
                </p>
              </div>

              <div className="comp-card">
                <h3 className="comp-card-title">Deductions</h3>
                <p className="comp-card-value">₹{data.totalDeductions}</p>
                <p className="comp-card-note">
                  PF: ₹{data.pf} • Tax: ₹{data.tax}
                </p>
              </div>
            </div>

            {/* BOTTOM: PAYSLIP SECTION */}
            <div className="comp-payslip-section">
              <div>
                <h3 className="comp-payslip-title">Payslip - VY</h3>
                <p className="comp-payslip-text">
                  Download your official payslip for{" "}
                  {
                    monthOptions.find((m) => m.value === Number(month))?.label
                  }{" "}
                  {year}. It contains your total present/absent days, salary
                  breakup and net income after deductions.
                </p>
              </div>

              <button
                className="comp-download-btn"
                onClick={handleDownloadPayslip}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download Payslip (PDF)"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Compensation;
