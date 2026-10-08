import "./FraudNetwork.css";
import {
  Network,
  ShieldAlert,
  Users,
  Link2,
  ArrowUpRight,
} from "lucide-react";


function FraudNetwork() {
  return (
    <main className="fraud-network-page">

      {/* HEADER */}

      <div className="fraud-network-header">

        <div>
          <p className="eyebrow">
            NETWORK ANALYSIS
          </p>

          <h1>
            Fraud Network
          </h1>

          <p className="fraud-description">
            Identify relationships between customers, orders,
            addresses and suspicious return activity.
          </p>
        </div>

      </div>


      {/* MAIN NETWORK CARD */}

      <section className="network-main-card">

        <div className="network-card-header">

          <div className="network-title">

            <div className="network-icon">
              <Network size={21} />
            </div>

            <div>
              <h2>
                Fraud Network Analysis
              </h2>

              <p>
                Connected entities and suspicious return patterns
              </p>
            </div>

          </div>

          <div className="network-status">
            <span></span>
            LIVE
          </div>

        </div>


        {/* NETWORK VISUAL */}

        <div className="network-visual">

          <div className="network-center">

            <div className="network-node center-node">
              <Network size={25} />
            </div>

            <strong>
              SwapGuard
            </strong>

            <span>
              Fraud Network
            </span>

          </div>


          <div className="network-node node-one">
            <Users size={18} />
            <span>Customers</span>
          </div>

          <div className="network-node node-two">
            <Link2 size={18} />
            <span>Orders</span>
          </div>

          <div className="network-node node-three">
            <ShieldAlert size={18} />
            <span>Risk Cases</span>
          </div>

          <div className="network-node node-four">
            <Network size={18} />
            <span>Addresses</span>
          </div>

          <div className="network-line line-one"></div>
          <div className="network-line line-two"></div>
          <div className="network-line line-three"></div>
          <div className="network-line line-four"></div>

        </div>

      </section>


      {/* STATISTICS */}

      <section className="network-stats-grid">

        <div className="network-stat-card">

          <div className="stat-icon blue">
            <Users size={19} />
          </div>

          <div className="stat-content">

            <span>
              CONNECTED CASES
            </span>

            <strong>
              24
            </strong>

            <small>
              <ArrowUpRight size={12} />
              8% this week
            </small>

          </div>

        </div>


        <div className="network-stat-card">

          <div className="stat-icon purple">
            <Link2 size={19} />
          </div>

          <div className="stat-content">

            <span>
              RELATIONSHIPS
            </span>

            <strong>
              18
            </strong>

            <small>
              Active connections
            </small>

          </div>

        </div>


        <div className="network-stat-card">

          <div className="stat-icon red">
            <ShieldAlert size={19} />
          </div>

          <div className="stat-content">

            <span>
              RISK NODES
            </span>

            <strong>
              07
            </strong>

            <small>
              Requires attention
            </small>

          </div>

        </div>

      </section>


      {/* NETWORK INSIGHT */}

      <section className="network-insight">

        <div className="insight-icon">
          <ShieldAlert size={18} />
        </div>

        <div>

          <strong>
            Network intelligence
          </strong>

          <p>
            Connected cases will be grouped using customer,
            address, order and return relationships to surface
            suspicious patterns.
          </p>

        </div>

      </section>

    </main>
  );
}

export default FraudNetwork;