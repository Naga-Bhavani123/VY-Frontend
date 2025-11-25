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

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// dynamically generate year options (last 5 years, current, next)
 const currentDate = new Date()
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
  const [days, setDays] = useState([]); // from backend
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
          `https://vy-backend.onrender.com/employee/attendance/month?year=${year}&month=${month}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.msg || "Failed to load attendance");
          setDays([]);
          return;
        }

        // data.days is coming from backend controller
        setDays(data.days || []);
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

  // Prepare calendar cells with leading blanks to match weekdays
  const getCalendarCells = () => {
    if (!year || !month || days.length === 0) {
      return [];
    }

    // figure out which weekday the month starts on
    const firstDayWeekday = new Date(year, month - 1, 1).getDay(); // 0-6

    // blank cells before 1st date
    const cells = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({ type: "empty", key: `empty-${i}` });
    }

    // real days from backend
    days.forEach((d) => {
      cells.push({ type: "day", data: d, key: d.date });
    });

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

          <div className="att-filters">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              onChange={(e) => setMonth(e.target.value)}
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
            <div className="att-loader-row">
              <div className="vy-dots-loader">
                <div className="vy-dot"></div>
                <div className="vy-dot"></div>
                <div className="vy-dot"></div>
              </div>
              <span className="att-loading-text">Loading attendance...</span>
            </div>
          )}

          {errorMsg && <p className="att-error-text">{errorMsg}</p>}

          {!loading && !year && !month && (
            <p className="att-info-text">
              Please select a year and month to view attendance.
            </p>
          )}

          {!loading && year && month && days.length === 0 && !errorMsg && (
            <p className="att-info-text">
              No attendance records found for this month.
            </p>
          )}

          {/* Weekdays header */}
          {year && month && (
            <>
              <div className="att-weekdays-row">
                {weekDays.map((day) => (
                  <div key={day} className="att-weekday-cell">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="att-days-grid">
                {calendarCells.map((cell) =>
                  cell.type === "empty" ? (
                    <div key={cell.key} className="att-day-cell empty" />
                  ) : (
                    <DayCell
                      key={cell.key}
                      dayData={cell.data}
                      getStatusInfo={getStatusInfo}
                    />
                  )
                )}
              </div>

              {/* Legend */}
              <div className="att-legend">
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
    <div className={`att-day-cell ${statusInfo.className}`}>
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
