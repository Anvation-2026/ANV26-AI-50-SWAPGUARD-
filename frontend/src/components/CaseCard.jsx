import {
  Package,
  ArrowRight,
  Clock3,
  MapPin,
} from "lucide-react";

function CaseCard({ caseData }) {
  const {
    id,
    product,
    category,
    value,
    risk,
    status,
    location,
    time,
  } = caseData;

  const getRiskClass = () => {
    if (risk >= 75) return "high";
    if (risk >= 40) return "medium";
    return "low";
  };

  return (
    <div className="case-card">
      <div className="case-main">
        <div className="case-product-icon">
          <Package size={22} />
        </div>

        <div className="case-info">
          <div className="case-id">{id}</div>
          <h3>{product}</h3>
          <span>{category}</span>
        </div>
      </div>

      <div className="case-value">
        <small>ORDER VALUE</small>
        <strong>₹{value.toLocaleString("en-IN")}</strong>
      </div>

      <div className="case-risk">
        <small>RISK SCORE</small>

        <div className="risk-row">
          <div className={`risk-badge ${getRiskClass()}`}>
            {risk}
          </div>

          <span>{status}</span>
        </div>
      </div>

      <div className="case-meta">
        <span>
          <MapPin size={14} />
          {location}
        </span>

        <span>
          <Clock3 size={14} />
          {time}
        </span>
      </div>

      <button className="case-action">
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

export default CaseCard;