// src/components/Attendance/index.jsx
import { useState, useEffect } from "react";
import Navbar from "../NavBar/index.jsx";
import "./index.css";

const monthsList = [
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

const BASE_URL = "https://vy-backend.onrender.com";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// dynamically generate year options (last 5 years, current, next)
const currentDate = new Date();
const getYearOptions = () => {
  const currentYear = currentDate.getFullYear();
  const years = [];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
};

const Attendance = () => {
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [days, setDays] = useState([]); // from backend, expected shape: [{ day: 1, date: "2025-11-01", status:"PRESENT", checkInTime, checkOutTime }, ...]
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const jwtToken = localStorage.getItem("jwt_token");

  // Fetch attendance when year & month selected
  useEffect(() => {
    if (!year || !month || !jwtToken) return;

    const fetchMonthAttendance = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(
          `${BASE_URL}/employee/attendance/month?year=${year}&month=${month}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        // Some endpoints might return an empty body with 204; guard it
        let data = null;
        const text = await res.text();
        try {
          data = text ? JSON.parse(text) : null;
        } catch (err) {
          // fallback: if response wasn't JSON, treat as failure
          data = null;
        }

        if (!res.ok) {
          setErrorMsg((data && data.msg) || "Failed to load attendance");
          setDays([]);
          return;
        }

        // data.days expected; fall back to [] if missing
        setDays((data && data.days) || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("Something went wrong. Please try again.");
        setDays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthAttendance();
  }, [year, month, jwtToken]);

  // Prepare calendar cells with leading blanks and trailing blanks to make full weeks
  const getCalendarCells = () => {
    // if we haven't loaded days, still compute empties for layout when necessary
    // ensure year/month are numbers
    const y = Number(year);
    const m = Number(month);
    if (!y || !m) return [];

    // figure out which weekday the month starts on
    const firstDayWeekday = new Date(y, m - 1, 1).getDay(); // 0-6

    // blank cells before 1st date
    const cells = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({ type: "empty", key: `empty-start-${i}` });
    }

    // add real days from backend (the backend must provide "day" number and a stable key like "date")
    if (Array.isArray(days) && days.length > 0) {
      days.forEach((d, idx) => {
        // use a stable key: prefer d.date, fallback to day index
        const k = d.date || `day-${d.day}-${idx}`;
        cells.push({ type: "day", data: d, key: k });
      });
    } else {
      // If backend didn't return per-day objects, generate neutral placeholders for the month
      // so the calendar layout stays consistent (optional)
      const daysInMonth = new Date(y, m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
          type: "day",
          data: { day: d, status: null, date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` },
          key: `placeholder-${d}`,
        });
      }
    }

    // trailing blanks to fill last week
    const remainder = cells.length % 7;
    if (remainder !== 0) {
      const toAdd = 7 - remainder;
      for (let i = 0; i < toAdd; i++) {
        cells.push({ type: "empty", key: `empty-end-${i}` });
      }
    }

    return cells;
  };

  const calendarCells = getCalendarCells();

  // helper to map status to class / label
  const getStatusInfo = (status) => {
    switch (status) {
      case "PRESENT":
        return { label: "Present", className: "present" };
      case "ABSENT":
        return { label: "Absent", className: "absent" };
      case "WEEKLY_OFF":
        return { label: "Weekly Off", className: "off" };
      default:
        return { label: status || "—", className: "neutral" };
    }
  };

  return (
    <>
      <Navbar />
      <div className="att-page">
        <div className="att-header-row">
          <h1 className="att-title">Attendance</h1>

          <div className="att-filters" role="region" aria-label="Attendance filters">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="att-select"
            >
              <option value="">Select Year</option>
              {getYearOptions().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="att-select"
            >
              <option value="">Select Month</option>
              {monthsList.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="att-card">
          {/* message / loader */}
          {loading && (
            <div className="att-loader-row" role="status" aria-live="polite">
              <div className="vy-dots-loader">
                <div className="vy-dot"></div>
                <div className="vy-dot"></div>
                <div className="vy-dot"></div>
              </div>
              <span className="att-loading-text">Loading attendance...</span>
            </div>
          )}

          {errorMsg && <p className="att-error-text" role="alert">{errorMsg}</p>}

          {!loading && !year && !month && (
            <p className="att-info-text">Please select a year and month to view attendance.</p>
          )}

          {!loading && year && month && days.length === 0 && !errorMsg && (
            <p className="att-info-text">No attendance records found for this month.</p>
          )}

          {/* Weekdays header + grid */}
          {year && month && (
            <>
              <div className="att-weekdays-row" role="row">
                {weekDays.map((day) => (
                  <div key={day} className="att-weekday-cell" role="columnheader">
                    {day}
                  </div>
                ))}
              </div>

              {/* wrapper enables horizontal scroll if viewport is too small */}
              <div className="att-days-wrapper" aria-hidden={calendarCells.length === 0 ? "true" : "false"}>
                <div className="att-days-grid" role="grid">
                  {calendarCells.map((cell) =>
                    cell.type === "empty" ? (
                      <div key={cell.key} className="att-day-cell empty" role="gridcell" />
                    ) : (
                      <DayCell
                        key={cell.key}
                        dayData={cell.data}
                        getStatusInfo={getStatusInfo}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="att-legend" aria-hidden={false}>
                <span>
                  <span className="att-legend-dot present-dot" /> Present
                </span>
                <span>
                  <span className="att-legend-dot absent-dot" /> Absent
                </span>
                <span>
                  <span className="att-legend-dot off-dot" /> Weekly Off
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// separate small component for a single day cell
const DayCell = ({ dayData, getStatusInfo }) => {
  const { day, status, checkInTime, checkOutTime } = dayData;
  const statusInfo = getStatusInfo(status);

  return (
    <div className={`att-day-cell ${statusInfo.className}`} role="gridcell" aria-label={`Day ${day} ${statusInfo.label}`}>
      <div className="att-day-number-row">
        <span className="att-day-number">{day}</span>
      </div>
      <div className="att-status-row">
        <span className="att-status-pill">{statusInfo.label}</span>
      </div>
      {(checkInTime || checkOutTime) && (
        <div className="att-times-row">
          {checkInTime && <span>In: {checkInTime}</span>}
          {checkOutTime && <span>Out: {checkOutTime}</span>}
        </div>
      )}
    </div>
  );
};

export default Attendance;
