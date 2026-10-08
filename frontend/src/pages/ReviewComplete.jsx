import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewComplete.css";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  UserCheck,
  Clock3,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

function ReviewComplete() {
  const navigate = useNavigate();

  const [review, setReview] = useState(null);

  const currentCase = JSON.parse(
    localStorage.getItem("swapguard_current_case") || "{}"
  );

  useEffect(() => {
    const savedReview = JSON.parse(
      localStorage.getItem("swapguard_review") || "null"
    );

    setReview(savedReview);
  }, []);

  const getDecisionText = () => {
    if (!review) return "Review Completed";

    if (review.decision === "confirmed") {
      return "Swap Confirmed";
    }

    if (review.decision === "legitimate") {
      return "Legitimate Return";
    }

    return "Case Escalated";
  };

  const getDecisionDescription = () => {
    if (!review) return "";

    if (review.decision === "confirmed") {
      return "The investigator confirmed that the returned product does not match the original delivery evidence.";
    }

    if (review.decision === "legitimate") {
      return "The investigator determined that the returned product is legitimate.";
    }

    return "The investigation has been escalated for additional review.";
  };

  const getDecisionClass = () => {
    if (!review) return "";

    if (review.decision === "confirmed") {
      return "decision-danger";
    }

    if (review.decision === "legitimate") {
      return "decision-success";
    }

    return "decision-warning";
  };

  if (!review) {
    return (
      <main className="review-complete-page">

        <div className="empty-complete">

          <FileText size={42} />

          <h2>No review found</h2>

          <p>
            Complete the human review before accessing
            the case resolution page.
          </p>

          <button
            onClick={() => navigate("/review")}
          >
            Go to Human Review
          </button>

        </div>

      </main>
    );
  }

  const reviewTime = new Date(
    review.reviewedAt
  ).toLocaleString("en-IN");

  return (
    <main className="review-complete-page">

      {/* HEADER */}

      <div className="complete-header">

        <div>

          <p className="eyebrow">
            CASE RESOLUTION
          </p>

          <h1>
            Investigation Completed
          </h1>

          <p>
            The investigation has been reviewed and a final
            decision has been recorded.
          </p>

        </div>

        <div className="complete-case">

          <span>CASE</span>

          <strong>
            {review.caseId ||
              currentCase.caseId ||
              "SG-DEMO"}
          </strong>

        </div>

      </div>


      {/* SUCCESS BANNER */}

      <section className="completion-banner">

        <div className="completion-icon">
          <CheckCircle2 size={34} />
        </div>

        <div>

          <p className="eyebrow">
            FINAL DECISION
          </p>

          <h2>
            {getDecisionText()}
          </h2>

          <p>
            {getDecisionDescription()}
          </p>

        </div>

      </section>


      {/* DECISION DETAILS */}

      <section className="completion-grid">

        <div className="completion-card">

          <div className="completion-card-icon blue">
            <ShieldCheck size={20} />
          </div>

          <span>
            AI RISK SCORE
          </span>

          <strong className="risk-number">
            87/100
          </strong>

          <small>
            High Risk
          </small>

        </div>


        <div className="completion-card">

          <div className="completion-card-icon green">
            <UserCheck size={20} />
          </div>

          <span>
            REVIEWER
          </span>

          <strong>
            {review.reviewer}
          </strong>

          <small>
            Compliance Investigator
          </small>

        </div>


        <div className="completion-card">

          <div className="completion-card-icon orange">
            <Clock3 size={20} />
          </div>

          <span>
            REVIEWED AT
          </span>

          <strong>
            {reviewTime}
          </strong>

          <small>
            Decision recorded
          </small>

        </div>

      </section>


      {/* DECISION */}

      <section className="final-decision-card">

        <div className="final-decision-header">

          <div>

            <p className="eyebrow">
              INVESTIGATOR DECISION
            </p>

            <h2>
              {getDecisionText()}
            </h2>

          </div>

          <div
            className={`decision-badge ${getDecisionClass()}`}
          >
            <CheckCircle2 size={15} />
            Finalized
          </div>

        </div>


        <div className="decision-details">

          <div>

            <span>
              CASE ID
            </span>

            <strong>
              {review.caseId ||
                currentCase.caseId ||
                "SG-DEMO"}
            </strong>

          </div>


          <div>

            <span>
              DECISION
            </span>

            <strong>
              {getDecisionText()}
            </strong>

          </div>


          <div>

            <span>
              REVIEWER
            </span>

            <strong>
              {review.reviewer}
            </strong>

          </div>

        </div>


        {review.notes && (

          <div className="investigator-notes">

            <span>
              INVESTIGATOR NOTES
            </span>

            <p>
              {review.notes}
            </p>

          </div>

        )}

      </section>


      {/* EVIDENCE STATUS */}

      <section className="evidence-complete">

        <div className="evidence-complete-header">

          <div>

            <p className="eyebrow">
              EVIDENCE TRAIL
            </p>

            <h2>
              Investigation Evidence
            </h2>

          </div>

          <div className="verified-status">
            <CheckCircle2 size={15} />
            Evidence Protected
          </div>

        </div>


        <div className="evidence-status-grid">

          <div>
            <CheckCircle2 size={17} />
            <span>
              Investigation Created
            </span>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>
              Delivery Evidence Captured
            </span>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>
              Return Evidence Captured
            </span>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>
              AI Analysis Completed
            </span>
          </div>

          <div>
            <CheckCircle2 size={17} />
            <span>
              Human Review Completed
            </span>
          </div>

        </div>

      </section>


      {/* ACTIONS */}

      <div className="complete-actions">

        <button
          className="back-dashboard"
          onClick={() => navigate("/")}
        >
          <LayoutDashboard size={16} />
          Back to Dashboard
        </button>

        <button
          className="new-investigation"
          onClick={() => {
            localStorage.removeItem(
              "swapguard_current_case"
            );

            localStorage.removeItem(
              "swapguard_delivery_evidence"
            );

            localStorage.removeItem(
              "swapguard_return_evidence"
            );

            localStorage.removeItem(
              "swapguard_review"
            );

            navigate("/investigation");
          }}
        >
          <ArrowLeft size={16} />
          Start New Investigation
        </button>

      </div>

    </main>
  );
}

export default ReviewComplete;