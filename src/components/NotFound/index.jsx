import { Link } from "react-router-dom";
import "./index.css";

const NotFound = () => {
  return (
    <div className="nf-container">
      <h1 className="nf-title">404</h1>
      <p className="nf-subtitle">Oops! Page not found.</p>

      <Link to="/" className="nf-back-btn">
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
