import {
  Package,
  Clock3,
  MapPin,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import "./CaseManagement.css";

import { useNavigate } from "react-router-dom";

function CaseManagement() {
  const navigate = useNavigate();

  const storedCase = localStorage.getItem(
    "swapguard_return_case"
  );

  const returnCase = storedCase
    ? JSON.parse(storedCase)
    : null;

  return (
    <main className="case-management-page">

      {/* HEADER */}

      <div className="case-management-header">

        <div>

          <p className="eyebrow">
            CASE MANAGEMENT
          </p>

          <h1>
            Return Requests
          </h1>

          <p>
            Manage customer return requests and prepare
            cases for pickup verification.
          </p>

        </div>

        <div className="case-count">

          <span>
            ACTIVE RETURNS
          </span>

          <strong>
            {returnCase ? "01" : "00"}
          </strong>

        </div>

      </div>


      {/* NO CASE */}

      {!returnCase && (

        <div className="empty-case-state">

          <div className="empty-case-icon">
            <RotateCcw size={28} />
          </div>

          <h2>
            No return requests
          </h2>

          <p>
            Customer return requests will appear here
            once they are created.
          </p>

        </div>

      )}


      {/* CASE */}

      {returnCase && (

        <section className="case-card">

          {/* CASE HEADER */}

          <div className="case-card-top">

            <div className="case-product">

              <div className="case-product-icon">
                <Package size={21} />
              </div>

              <div>

                <span>
                  {returnCase.caseId}
                </span>

                <h2>
                  {returnCase.product}
                </h2>

                <small>
                  Order #{returnCase.orderId}
                </small>

              </div>

            </div>


            <div className="case-status">
              <span></span>
              {returnCase.status}
            </div>

          </div>


          {/* DETAILS */}

          <div className="case-details">

            <div>

              <span>
                ORDER VALUE
              </span>

              <strong>
                {returnCase.orderValue}
              </strong>

            </div>


            <div>

              <span>
                LOCATION
              </span>

              <strong>
                <MapPin size={13} />
                {returnCase.location}
              </strong>

            </div>


            <div>

              <span>
                REQUESTED
              </span>

              <strong>
                <Clock3 size={13} />
                Just now
              </strong>

            </div>


            <div>

              <span>
                VERIFICATION ATTEMPTS
              </span>

              <strong>
                {returnCase.attempts} / 3
              </strong>

            </div>

          </div>


          {/* ORIGINAL EVIDENCE */}

          <div className="original-evidence">

            <div className="evidence-check">
              <CheckCircle2 size={18} />
            </div>

            <div>

              <strong>
                Original delivery evidence available
              </strong>

              <p>
                6 delivery angles are locked and ready
                for return comparison.
              </p>

            </div>

          </div>


          {/* ACTION */}

          <div className="case-card-footer">

            <div>

              <span>
                NEXT ACTION
              </span>

              <strong>
                Pickup agent verification
              </strong>

            </div>

            <button
              onClick={() =>
                navigate(
                  `/return-verification?case=${returnCase.caseId}`
                )
              }
            >
              Open Case
              <ArrowRight size={16} />
            </button>

          </div>

        </section>

      )}

    </main>
  );
}

export default CaseManagement;