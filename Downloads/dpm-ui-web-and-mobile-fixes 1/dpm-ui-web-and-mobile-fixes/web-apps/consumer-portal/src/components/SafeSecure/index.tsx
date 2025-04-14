import SafeIcon from "assets/Payment/frame.svg";
import "./index.scss";

export default function SafeSecure() {
  return (
    <div className="safe-secure">
      <div>
        <img src={SafeIcon} alt="safe-secure-icon" />
      </div>
      <div className="safe-secure-content">
        Safe and Secure Payments. Easy servicing. 100% Authentic products.
      </div>
    </div>
  );
}
