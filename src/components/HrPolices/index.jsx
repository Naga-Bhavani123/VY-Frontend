import Navbar from "../NavBar/index.jsx";
import "./index.css";

const HrPolicies = () => {
  return (
    <>
      <Navbar />
      <div className="hr-page">
        {/* Header */}
        <div className="hr-header">
          <h2 className="hr-title">HR Policies</h2>
          <p className="hr-subtitle">
            Basic HR guidelines for VY employees – POSH, leaves, referrals,
            attendance and more.
          </p>
        </div>

        {/* POSH */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">1. POSH (Prevention of Sexual Harassment)</h3>
          <p className="hr-section-text">
            VY follows a zero-tolerance policy towards any form of sexual
            harassment in the workplace.
          </p>
          <ul className="hr-list">
            <li>All complaints will be handled confidentially by the POSH committee.</li>
            <li>Employees can report incidents directly to HR or via official email.</li>
            <li>No retaliation is allowed against anyone who raises a complaint.</li>
            <li>POSH awareness sessions will be conducted regularly.</li>
          </ul>
        </section>

        {/* Leaves */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">2. Leave Policy</h3>
          <p className="hr-section-text">
            Leaves must be planned in advance wherever possible. Emergency and
            sick leaves should be informed to the reporting manager.
          </p>

          <div className="hr-table">
            <div className="hr-table-header">
              <span>Leave Type</span>
              <span>Count / Year</span>
              <span>Notes</span>
            </div>
            <div className="hr-table-row">
              <span>Casual Leave (CL)</span>
              <span>12</span>
              <span>For personal work, max 2 days at a time.</span>
            </div>
            <div className="hr-table-row">
              <span>Sick Leave (SL)</span>
              <span>6</span>
              <span>Medical proof may be required for long leaves.</span>
            </div>
            <div className="hr-table-row">
              <span>Earned Leave (EL)</span>
              <span>15</span>
              <span>Can be carried forward or encashed as per policy.</span>
            </div>
            <div className="hr-table-row">
              <span>Maternity Leave</span>
              <span>As per law</span>
              <span>Available for eligible female employees.</span>
            </div>
            <div className="hr-table-row">
              <span>Paternity Leave</span>
              <span>7 days</span>
              <span>For male employees at the time of childbirth.</span>
            </div>
          </div>
        </section>

        {/* Referrals */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">3. Employee Referral Policy</h3>
          <p className="hr-section-text">
            Employees are encouraged to refer talented candidates to VY.
            Successful referrals are rewarded.
          </p>
          <ul className="hr-list">
            <li>Referrals must be shared through the official referral channel / HR mail.</li>
            <li>Bonus will be processed after the referred candidate completes probation.</li>
            <li>Referral bonus amount depends on the role and level.</li>
          </ul>
        </section>

        {/* Attendance & Working Hours */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">4. Attendance & Working Hours</h3>
          <ul className="hr-list">
            <li>Standard working hours: 9:30 AM to 6:30 PM.</li>
            <li>Employees must mark daily clock-in and clock-out in the VY portal.</li>
            <li>Sunday is weekly off. Other holidays will be communicated by HR.</li>
            <li>Repeated unapproved absences may lead to disciplinary action.</li>
          </ul>
        </section>

        {/* Work From Home */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">5. Work From Home (WFH)</h3>
          <ul className="hr-list">
            <li>
              WFH is allowed only with prior approval from reporting manager and HR.
            </li>
            <li>Allowed in case of health issues, emergencies, or special situations.</li>
            <li>Employees must be available online during working hours when on WFH.</li>
          </ul>
        </section>

        {/* Conduct & Behavior */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">6. Code of Conduct</h3>
          <ul className="hr-list">
            <li>Maintain professional and respectful behavior with all colleagues.</li>
            <li>No discrimination based on gender, religion, caste, or background.</li>
            <li>Use of abusive language or harassment is strictly prohibited.</li>
          </ul>
        </section>

        {/* Exit / Notice */}
        <section className="hr-section-card">
          <h3 className="hr-section-title">7. Resignation & Notice Period</h3>
          <ul className="hr-list">
            <li>Standard notice period is 30 days (unless mentioned differently in offer letter).</li>
            <li>Knowledge transfer and proper handover are mandatory before the last working day.</li>
            <li>Final settlement, PF and documents will be processed after clearance.</li>
          </ul>
        </section>

        {/* HR Contact */}
        <section className="hr-section-card hr-contact-card">
          <h3 className="hr-section-title">HR Contact</h3>
          <p className="hr-section-text">
            For any doubts related to HR policies, you can reach out to the HR team.
          </p>
          <p className="hr-contact-line">📧 Email: hr@vy.com</p>
          <p className="hr-contact-line">📞 Phone: 9182724779</p>
        </section>
      </div>
    </>
  );
};

export default HrPolicies;
