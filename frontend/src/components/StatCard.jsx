import { ArrowUpRight } from "lucide-react";

function StatCard({ title, value, subtitle, icon: Icon, type }) {
  return (
    <div className={`stat-card ${type || ""}`}>
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={21} />
        </div>

        <ArrowUpRight size={18} className="stat-arrow" />
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-title">{title}</div>

      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

export default StatCard;