import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock3,
  ScanSearch,
  Fingerprint,
  History,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import "./AIAnalysis.css";

function AIAnalysis() {
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentCase = JSON.parse(
    localStorage.getItem("swapguard_current_case") || "{}"
  );

  const deliveryEvidence = JSON.parse(
    localStorage.getItem("swapguard_delivery_evidence") || "{}"
  );

  const returnEvidence = JSON.parse(
    localStorage.getItem("swapguard_return_evidence") || "{}"
  );

  useEffect(() => {
    let value = 0;

    const timer = setInterval(() => {
      value += 5;

      setProgress(value);

      if (value >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setAnalyzing(false);
        }, 400);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const deliveryCount =
    deliveryEvidence.captures?.length || 0;

  const returnCount =
    returnEvidence.captures?.length || 0;

  /*
    DEMO AI RESULT

    Later this will come from our Python
    PyTorch + OpenCV engine.
  */

  const visualMatch = 32;
  const markerMatch = 0;
  const historyScore = 72;
  const timingScore = 18;

  const riskScore = 87;

  const getRiskLabel = () => {
    if (riskScore >= 75) return "HIGH RISK";
    if (riskScore >= 40) return "REVIEW";
    return "LOW RISK";
  };

  const getRiskColor = () => {
    if (riskScore >= 75) return "risk-high";
    if (riskScore >= 40) return "risk-medium";
    return "risk-low";
  };

  return (
    <main className="ai-analysis-page">

      {/* HEADER */}

      <div className="ai-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/return-verification")
            }
          >
            <ArrowLeft size={17} />
            Back to Return Verification
          </button>

          <p className="eyebrow">
            STEP 3 OF 4
          </p>

          <h1>AI Evidence Analysis</h1>

          <p>
            Comparing delivery and return evidence to identify
            potential product swaps.
          </p>

        </div>

        <div className="ai-case-id">

          <span>CASE</span>

          <strong>
            {currentCase.caseId || "SG-DEMO"}
          </strong>

        </div>

      </div>


      {/* ANALYSIS STATUS */}

      {analyzing ? (

        <section className="analysis-running">

          <div className="analysis-loader">
            <BrainCircuit size={30} />
          </div>

          <div className="analysis-running-content">

            <strong>
              AI engine analyzing evidence...
            </strong>

            <span>
              Comparing visual fingerprints, markers,
              history and timing.
            </span>

            <div className="analysis-progress">

              <div
                className="analysis-progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>

            </div>

          </div>

          <strong className="analysis-percent">
            {progress}%
          </strong>

        </section>

      ) : (

        <>
          {/* RESULT */}

          <section className="risk-result">

            <div className="risk-score-circle">

              <div>

                <strong>
                  {riskScore}
                </strong>

                <span>
                  /100
                </span>

              </div>

            </div>


            <div className="risk-result-content">

              <p className="eyebrow">
                EXPLAINABLE RISK SCORE
              </p>

              <h2>
                {getRiskLabel()}
              </h2>

              <p>
                The evidence shows significant differences
                between the original delivery and returned
                product.
              </p>

              <div className="risk-recommendation">

                <AlertTriangle size={17} />

                <span>
                  Recommended action:
                  <strong>
                    Human Review
                  </strong>
                </span>

              </div>

            </div>

          </section>


          {/* EVIDENCE SUMMARY */}

          <section className="analysis-grid">

            <div className="analysis-card">

              <div className="analysis-card-header">

                <div className="analysis-card-icon blue">
                  <ScanSearch size={19} />
                </div>

                <div>
                  <strong>
                    Visual Fingerprint
                  </strong>

                  <span>
                    Delivery vs Return
                  </span>
                </div>

              </div>


              <div className="match-score">

                <strong>
                  {visualMatch}%
                </strong>

                <span>
                  Visual Match
                </span>

              </div>


              <div className="match-bar">

                <div
                  style={{
                    width: `${visualMatch}%`,
                  }}
                ></div>

              </div>


              <div className="analysis-detail">

                <span>
                  <CheckCircle2 size={14} />
                  Image angles compared
                </span>

                <strong>
                  {deliveryCount}/{returnCount}
                </strong>

              </div>

            </div>


            <div className="analysis-card">

              <div className="analysis-card-header">

                <div className="analysis-card-icon purple">
                  <Fingerprint size={19} />
                </div>

                <div>
                  <strong>
                    Hidden Marker
                  </strong>

                  <span>
                    Platform-issued marker
                  </span>
                </div>

              </div>


              <div className="marker-result">

                <div className="marker-icon">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <strong>
                    Marker Mismatch
                  </strong>

                  <span>
                    Delivery marker was not detected
                    in return evidence.
                  </span>
                </div>

              </div>

            </div>


            <div className="analysis-card">

              <div className="analysis-card-header">

                <div className="analysis-card-icon orange">
                  <History size={19} />
                </div>

                <div>
                  <strong>
                    Case History
                  </strong>

                  <span>
                    Historical behavior
                  </span>
                </div>

              </div>


              <div className="history-score">

                <strong>
                  {historyScore}/100
                </strong>

                <span>
                  Elevated risk history
                </span>

              </div>


              <div className="history-tags">

                <span>
                  Previous return
                </span>

                <span>
                  High-value item
                </span>

              </div>

            </div>


            <div className="analysis-card">

              <div className="analysis-card-header">

                <div className="analysis-card-icon green">
                  <Clock3 size={19} />
                </div>

                <div>
                  <strong>
                    Timing Signal
                  </strong>

                  <span>
                    Return behavior
                  </span>
                </div>

              </div>


              <div className="timing-result">

                <strong>
                  {timingScore} hrs
                </strong>

                <span>
                  Return initiated after delivery
                </span>

              </div>

            </div>

          </section>


          {/* EVIDENCE INTEGRITY */}

          <section className="integrity-section">

            <div className="integrity-header">

              <div>

                <p className="eyebrow">
                  EVIDENCE TRAIL
                </p>

                <h2>
                  Evidence Integrity
                </h2>

              </div>

              <div className="integrity-status">

                <ShieldCheck size={16} />

                Verified

              </div>

            </div>


            <div className="integrity-grid">

              <div className="integrity-item">

                <span>
                  Delivery captures
                </span>

                <strong>
                  {deliveryCount}/6
                </strong>

              </div>

              <div className="integrity-item">

                <span>
                  Return captures
                </span>

                <strong>
                  {returnCount}/6
                </strong>

              </div>

              <div className="integrity-item">

                <span>
                  Marker verification
                </span>

                <strong className="danger">
                  Mismatch
                </strong>

              </div>

              <div className="integrity-item">

                <span>
                  Evidence status
                </span>

                <strong className="success">
                  Protected
                </strong>

              </div>

            </div>

          </section>


          {/* ACTIONS */}

          <div className="analysis-actions">

            <button
              className="secondary-analysis-button"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
              Re-run Analysis
            </button>

            <button
              className="review-button"
              onClick={() =>
                navigate("/review")
              }
            >
              Send to Human Review
              <ArrowRight size={17} />
            </button>

          </div>

        </>

      )}

    </main>
  );
}

export default AIAnalysis;