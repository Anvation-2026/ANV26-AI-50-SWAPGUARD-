import {
  LayoutDashboard,
  Search,
  FileSearch,
  BrainCircuit,
  ClipboardCheck,
  Network,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Investigations",
      path: "/investigation",
      icon: Search,
    },
    {
      name: "Evidence",
      path: "/evidence",
      icon: FileSearch,
    },
    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: BrainCircuit,
    },
    {
     name: "Case Management",
    path: "/case-management",
     icon: ClipboardCheck,
    },
    {
      name: "Fraud Network",
      path: "/fraud-network",
      icon: Network,
    },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-brand">

        <div className="brand-icon">
          <ShieldIcon />
        </div>

        <div>
          <h2>SwapGuard</h2>
          <span>Compliance Engine</span>
        </div>

      </div>


      {/* MENU */}

      <div className="sidebar-section-title">
        WORKSPACE
      </div>


      <nav className="sidebar-nav">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <Icon size={21} />

              <span>
                {item.name}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* SYSTEM STATUS */}

      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>
              System Online
            </strong>

            <small>
              All services operational
            </small>
          </div>

        </div>

        <div className="version">
          SwapGuard v1.0
        </div>

      </div>

    </aside>
  );
}


/* Simple shield icon */

function ShieldIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3L20 6V11C20 16.5 16.5 20 12 21C7.5 20 4 16.5 4 11V6L12 3Z" />
      <path d="M9 12L11 14L15 10" />
    </svg>
  );
}

export default Sidebar;