import {
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="page-heading">
          <span>Compliance Workspace</span>
          <h2>Investigation Dashboard</h2>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search cases, orders..."
          />
        </div>

        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">
            <ShieldCheck size={19} />
          </div>

          <div className="profile-info">
            <strong>Compliance Admin</strong>
            <span>Investigator</span>
          </div>

          <ChevronDown size={17} />
        </div>
      </div>
    </header>
  );
}

export default Topbar;