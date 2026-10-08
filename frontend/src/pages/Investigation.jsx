import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  IndianRupee,
  User,
  Store,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

function Investigation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderId: "",
    product: "",
    category: "",
    value: "",
    customer: "",
    seller: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.orderId ||
      !formData.product ||
      !formData.category ||
      !formData.value ||
      !formData.customer ||
      !formData.seller
    ) {
      alert("Please fill in all investigation details.");
      return;
    }

    const investigation = {
      ...formData,
      caseId: `SG-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      stage: "delivery",
      risk: null,
    };

    localStorage.setItem(
      "swapguard_current_case",
      JSON.stringify(investigation)
    );

    navigate("/evidence");
  };

  return (
    <main className="investigation-page">

      <div className="investigation-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <p className="eyebrow">NEW CASE</p>

          <h1>Create Investigation</h1>

          <p>
            Start a new compliance investigation for a high-value
            return.
          </p>
        </div>

        <div className="case-status">
          <span className="status-dot"></span>
          Ready to create
        </div>

      </div>


      <div className="investigation-layout">

        <form
          className="investigation-form-card"
          onSubmit={handleSubmit}
        >

          <div className="card-heading">

            <div className="heading-icon">
              <Package size={20} />
            </div>

            <div>
              <h2>Order Information</h2>

              <p>
                Enter the basic details of the returned product.
              </p>
            </div>

          </div>


          <div className="form-grid">

            {/* Order ID */}

            <div className="form-group">
              <label>Order ID</label>

              <div className="input-wrapper">
                <ShoppingBag size={17} />

                <input
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. ORD-2026-1024"
                />
              </div>
            </div>


            {/* Product */}

            <div className="form-group">
              <label>Product Name</label>

              <div className="input-wrapper">
                <Package size={17} />

                <input
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Nike Air Max"
                />
              </div>
            </div>


            {/* Category */}

            <div className="form-group">
              <label>Category</label>

              <div className="input-wrapper">
                <Package size={17} />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Footwear">
                    Footwear
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Mobile Phones">
                    Mobile Phones
                  </option>

                  <option value="Accessories">
                    Accessories
                  </option>
                </select>
              </div>
            </div>


            {/* Value */}

            <div className="form-group">
              <label>Order Value</label>

              <div className="input-wrapper">
                <IndianRupee size={17} />

                <input
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="10000"
                />
              </div>
            </div>


            {/* Customer */}

            <div className="form-group">
              <label>Customer</label>

              <div className="input-wrapper">
                <User size={17} />

                <input
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  type="text"
                  placeholder="Customer name"
                />
              </div>
            </div>


            {/* Seller */}

            <div className="form-group">
              <label>Seller</label>

              <div className="input-wrapper">
                <Store size={17} />

                <input
                  name="seller"
                  value={formData.seller}
                  onChange={handleChange}
                  type="text"
                  placeholder="Seller / merchant"
                />
              </div>
            </div>

          </div>


          <div className="evidence-notice">

            <div className="notice-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>
                Evidence protection enabled
              </strong>

              <p>
                Delivery and return evidence will be
                timestamped and securely recorded for this
                investigation.
              </p>
            </div>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="continue-button"
            >
              Continue to Delivery Capture
              <ArrowRight size={17} />
            </button>

          </div>

        </form>


        <aside className="investigation-info">

          <div className="info-card">

            <p className="eyebrow">
              INVESTIGATION FLOW
            </p>

            <h3>
              Evidence-first verification
            </h3>

            <p className="info-description">
              SwapGuard compares evidence captured at delivery
              with evidence captured during the return process.
            </p>


            <div className="flow-step active">

              <div className="flow-number">
                1
              </div>

              <div>
                <strong>
                  Delivery Capture
                </strong>

                <span>
                  Record the original product condition.
                </span>
              </div>

            </div>


            <div className="flow-line"></div>


            <div className="flow-step">

              <div className="flow-number">
                2
              </div>

              <div>
                <strong>
                  Return Verification
                </strong>

                <span>
                  Capture the returned product.
                </span>
              </div>

            </div>


            <div className="flow-line"></div>


            <div className="flow-step">

              <div className="flow-number">
                3
              </div>

              <div>
                <strong>
                  AI Analysis
                </strong>

                <span>
                  Compare visual fingerprints and markers.
                </span>
              </div>

            </div>


            <div className="flow-line"></div>


            <div className="flow-step">

              <div className="flow-number">
                4
              </div>

              <div>
                <strong>
                  Decision
                </strong>

                <span>
                  Generate an explainable risk score.
                </span>
              </div>

            </div>

          </div>


          <div className="security-card">

            <ShieldCheck size={22} />

            <div>
              <strong>
                Secure evidence trail
              </strong>

              <span>
                Evidence integrity will be protected using
                cryptographic hashing.
              </span>
            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Investigation;