import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  FileText,
  Clock3,
  Package,
  MapPin,
} from "lucide-react";
import "./Review.css";

function Review() {
  const navigate = useNavigate();

  const [decision, setDecision] = useState("");
  const [notes, setNotes] = useState("");

  const currentCase = JSON.parse(
    localStorage.getItem("swapguard_current_case") || "{}"
  );

  const handleDecision = (selectedDecision) => {
    setDecision(selectedDecision);
  };

  const submitReview = () => {
    if (!decision) {
      alert("Please select a final decision.");
      return;
    }

    const review = {
      caseId: currentCase.caseId,
      decision,
      notes,
      reviewedAt: new Date().toISOString(),
      reviewer: "Compliance Admin",
    };

    localStorage.setItem(
      "swapguard_review",
      JSON.stringify(review)
    );

    navigate("/review-complete");
  };

  return (
    <main className="review-page">

      {/* HEADER */}

      <div className="review-header">

        <div>

          <button
            className="back-button"
            onClick={() => navigate("/ai-analysis")}
          >
            <ArrowLeft size={17} />
            Back to AI Analysis
          </button>

          <p className="eyebrow">
            STEP 4 OF 4
          </p>

          <h1>Human Review</h1>

          <p>
            Review the evidence and AI findings before making
            the final compliance decision.
          </p>

        </div>

        <div className="review-case">

          <span>CASE</span>

          <strong>
            {currentCase.caseId || "SG-DEMO"}
          </strong>

        </div>

      </div>


      {/* ALERT */}

      <div className="review-alert">

        <div className="review-alert-icon">
          <ShieldAlert size={20} />
        </div>

        <div>

          <strong>
            High-risk investigation requires human review
          </strong>

          <span>
            AI findings are recommendations. The investigator
            must make the final decision.
          </span>

        </div>

      </div>


      <div className="review-layout">

        {/* LEFT */}

        <section className="review-main">

          {/* CASE SUMMARY */}

          <div className="review-card">

            <div className="review-card-header">

              <div>
                <p className="eyebrow">
                  CASE SUMMARY
                </p>

                <h2>
                  Investigation Overview
                </h2>
              </div>

              <div className="high-risk-badge">
                <AlertTriangle size={14} />
                HIGH RISK
              </div>

            </div>


            <div className="case-summary-grid">

              <div className="summary-item">
                <Package size={16} />

                <div>
                  <span>PRODUCT</span>
                  <strong>
                    {currentCase.product || "Nike Air Max"}
                  </strong>
                </div>
              </div>


              <div className="summary-item">
                <FileText size={16} />

                <div>
                  <span>ORDER ID</span>
                  <strong>
                    {currentCase.orderId || "ORD-2026-1024"}
                  </strong>
                </div>
              </div>


              <div className="summary-item">
                <MapPin size={16} />

                <div>
                  <span>LOCATION</span>
                  <strong>Bengaluru</strong>
                </div>
              </div>


              <div className="summary-item">
                <Clock3 size={16} />

                <div>
                  <span>STATUS</span>
                  <strong>Awaiting decision</strong>
                </div>
              </div>

            </div>

          </div>


          {/* AI FINDINGS */}

          <div className="review-card">

            <div className="review-card-header">

              <div>

                <p className="eyebrow">
                  AI FINDINGS
                </p>

                <h2>
                  Evidence Signals
                </h2>

              </div>

              <span className="ai-score">
                Risk Score: 87
              </span>

            </div>


            <div className="finding-list">

              <div className="finding danger">

                <div className="finding-icon">
                  <XCircle size={18} />
                </div>

                <div>

                  <strong>
                    Visual mismatch detected
                  </strong>

                  <span>
                    Delivery and return evidence produced a
                    32% visual match.
                  </span>

                </div>

              </div>


              <div className="finding danger">

                <div className="finding-icon">
                  <ShieldAlert size={18} />
                </div>

                <div>

                  <strong>
                    Hidden marker mismatch
                  </strong>

                  <span>
                    The platform-issued marker was not detected
                    in the returned evidence.
                  </span>

                </div>

              </div>


              <div className="finding warning">

                <div className="finding-icon">
                  <AlertTriangle size={18} />
                </div>

                <div>

                  <strong>
                    Elevated customer history
                  </strong>

                  <span>
                    Historical behavior contributes to the
                    elevated risk score.
                  </span>

                </div>

              </div>


              <div className="finding success">

                <div className="finding-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>

                  <strong>
                    Evidence capture complete
                  </strong>

                  <span>
                    All required delivery and return angles
                    were captured.
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* DECISION */}

          <div className="review-card">

            <div className="review-card-header">

              <div>

                <p className="eyebrow">
                  FINAL DECISION
                </p>

                <h2>
                  Investigator Decision
                </h2>

              </div>

            </div>


            <div className="decision-grid">

              <button
                className={`decision-option ${
                  decision === "confirmed"
                    ? "selected danger-option"
                    : ""
                }`}
                onClick={() =>
                  handleDecision("confirmed")
                }
              >

                <XCircle size={22} />

                <strong>
                  Confirm Swap
                </strong>

                <span>
                  Evidence supports a product substitution.
                </span>

              </button>


              <button
                className={`decision-option ${
                  decision === "legitimate"
                    ? "selected success-option"
                    : ""
                }`}
                onClick={() =>
                  handleDecision("legitimate")
                }
              >

                <CheckCircle2 size={22} />

                <strong>
                  Legitimate Return
                </strong>

                <span>
                  Evidence supports the returned product.
                </span>

              </button>


              <button
                className={`decision-option ${
                  decision === "escalate"
                    ? "selected warning-option"
                    : ""
                }`}
                onClick={() =>
                  handleDecision("escalate")
                }
              >

                <AlertTriangle size={22} />

                <strong>
                  Escalate
                </strong>

                <span>
                  Send the case for additional investigation.
                </span>

              </button>

            </div>


            <div className="notes-section">

              <label>
                Investigator Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Add observations, reasoning or additional evidence..."
              />

            </div>


            <div className="review-actions">

              <button
                className="review-cancel"
                onClick={() =>
                  navigate("/ai-analysis")
                }
              >
                Cancel
              </button>

              <button
                className="submit-review"
                onClick={submitReview}
              >
                <UserCheck size={17} />
                Submit Decision
              </button>

            </div>

          </div>

        </section>


        {/* RIGHT */}

        <aside className="review-sidebar">

          <div className="review-score-card">

            <p className="eyebrow">
              AI RISK SCORE
            </p>

            <div className="review-score">
              87
              <span>/100</span>
            </div>

            <strong>
              HIGH RISK
            </strong>

            <p>
              Human review required before the case can
              be closed.
            </p>

          </div>


          <div className="review-timeline">

            <p className="eyebrow">
              INVESTIGATION TIMELINE
            </p>

            <div className="timeline-item complete">

              <div className="timeline-dot">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>
                  Investigation Created
                </strong>

                <span>
                  Case registered
                </span>
              </div>

            </div>


            <div className="timeline-item complete">

              <div className="timeline-dot">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>
                  Delivery Evidence
                </strong>

                <span>
                  6 angles captured
                </span>
              </div>

            </div>


            <div className="timeline-item complete">

              <div className="timeline-dot">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>
                  Return Evidence
                </strong>

                <span>
                  6 angles captured
                </span>
              </div>

            </div>


            <div className="timeline-item complete">

              <div className="timeline-dot">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>
                  AI Analysis
                </strong>

                <span>
                  Risk score generated
                </span>
              </div>

            </div>


            <div className="timeline-item active">

              <div className="timeline-dot">
                <UserCheck size={14} />
              </div>

              <div>
                <strong>
                  Human Review
                </strong>

                <span>
                  Awaiting decision
                </span>
              </div>

            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Review;