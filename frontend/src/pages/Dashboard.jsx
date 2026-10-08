import {
  ShieldAlert,
  AlertTriangle,
  ClipboardCheck,
  Activity,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import CaseCard from "../components/CaseCard";
import { demoCases } from "../data/demoCases";
import "./Dashboard.css";
import "./DeliveryCapture.css";

function Dashboard() {
     const navigate = useNavigate();
  return (
    <main className="dashboard-page">

      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Good afternoon, Investigator.</h1>

          <p>
            Monitor return investigations and identify potential
            product swaps.
          </p>
        </div>

        <button
        className="new-investigation"
         onClick={() => navigate("/investigation")}
        >
        <ShieldAlert size={18} />
         New Investigation
        </button>
      </div>

      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          title="Active Cases"
          value="24"
          subtitle="+8% from last week"
          icon={Activity}
          type="blue"
        />

        <StatCard
          title="High Risk Cases"
          value="07"
          subtitle="Requires attention"
          icon={AlertTriangle}
          type="red"
        />

        <StatCard
          title="Pending Reviews"
          value="05"
          subtitle="Awaiting investigator"
          icon={ClipboardCheck}
          type="yellow"
        />

        <StatCard
          title="Verified Returns"
          value="138"
          subtitle="This month"
          icon={ShieldAlert}
          type="green"
        />

      </section>

      {/* Cases */}
      <section className="cases-section">

        <div className="section-header">
          <div>
            <p className="eyebrow">CASE MANAGEMENT</p>
            <h2>Recent Investigations</h2>
          </div>

          <button className="view-all">
            View all cases →
          </button>
        </div>

        <div className="cases-list">
          {demoCases.map((caseData) => (
            <CaseCard
              key={caseData.id}
              caseData={caseData}
            />
          ))}
        </div>

      </section>

    </main>
  );
}

export default Dashboard;