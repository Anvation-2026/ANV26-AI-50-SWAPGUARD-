import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Camera,
  CheckCircle2,
  MapPin,
  Clock3,
  Lock,
  RotateCcw,
  Package,
} from "lucide-react";

const angles = [
  "Front",
  "Back",
  "Left",
  "Right",
  "Top",
  "Bottom",
];

function DeliveryCapture() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [currentAngle, setCurrentAngle] = useState(0);
  const [photos, setPhotos] = useState({});
  const [cameraError, setCameraError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const order = {
    orderId: "ORD-23435",
    product: "Nike Air Max",
    category: "Footwear",
    value: "₹10,000",
  };

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error);

      setCameraError(
        "Camera access was blocked. Please allow camera permission and try again."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image = canvas.toDataURL("image/jpeg", 0.85);

    const angleName = angles[currentAngle];

    setPhotos((previous) => ({
      ...previous,
      [angleName]: {
        image,
        timestamp: new Date().toISOString(),
      },
    }));

    setCapturing(true);

    setTimeout(() => {
      setCapturing(false);

      if (currentAngle < angles.length - 1) {
        setCurrentAngle((previous) => previous + 1);
      }
    }, 400);
  };

  const retakePhoto = (angle) => {
    const angleIndex = angles.indexOf(angle);

    setCurrentAngle(angleIndex);

    setPhotos((previous) => {
      const updated = { ...previous };
      delete updated[angle];
      return updated;
    });

    setCapturing(false);
  };

  const completeDelivery = () => {
    if (Object.keys(photos).length !== 6) {
      return;
    }

    const deliveryEvidence = {
      order,
      photos,
      gps: {
        status: "captured",
        location: "Bengaluru",
      },
      timestamp: new Date().toISOString(),
      marker: {
        status: "registered",
        id: `SG-MARK-${Math.floor(
          10000 + Math.random() * 90000
        )}`,
      },
      locked: true,
    };

    localStorage.setItem(
      "swapguard_delivery_evidence",
      JSON.stringify(deliveryEvidence)
    );

    setCompleted(true);

    stopCamera();
  };

  const capturedCount = Object.keys(photos).length;

  if (completed) {
    return (
      <main className="delivery-page">

        <div className="delivery-complete">

          <div className="delivery-complete-icon">
            <Lock size={34} />
          </div>

          <p className="eyebrow">
            DELIVERY COMPLETED
          </p>

          <h1>
            Evidence Locked
          </h1>

          <p>
            The original delivery evidence has been
            successfully registered and locked.
          </p>

          <div className="delivery-case-card">

            <div>
              <span>ORDER</span>
              <strong>{order.orderId}</strong>
            </div>

            <div>
              <span>PRODUCT</span>
              <strong>{order.product}</strong>
            </div>

            <div>
              <span>MARKER</span>
              <strong>
                Registered
              </strong>
            </div>

          </div>

          <div className="delivery-verification-list">

            <div>
              <CheckCircle2 size={17} />
              6 delivery angles captured
            </div>

            <div>
              <CheckCircle2 size={17} />
              GPS location recorded
            </div>

            <div>
              <CheckCircle2 size={17} />
              Timestamp recorded
            </div>

            <div>
              <CheckCircle2 size={17} />
              Platform marker registered
            </div>

          </div>

          <div className="delivery-complete-actions">

            <button
              className="return-request-button"
              onClick={() => {
                const deliveryEvidence =
                  JSON.parse(
                    localStorage.getItem(
                      "swapguard_delivery_evidence"
                    )
                  );

                const returnCase = {
                  caseId: `SG-${Math.floor(
                    1000 + Math.random() * 9000
                  )}`,

                  orderId:
                    deliveryEvidence.order.orderId,

                  product:
                    deliveryEvidence.order.product,

                  orderValue:
                    deliveryEvidence.order.value,

                  location:
                    deliveryEvidence.gps.location,

                  status:
                    "Awaiting Pickup",

                  attempts: 0,

                  originalEvidence:
                    deliveryEvidence,

                  returnEvidence: [],

                  createdAt:
                    new Date().toISOString(),

                  decision: null,
                };

                localStorage.setItem(
                  "swapguard_return_case",
                  JSON.stringify(returnCase)
                );

                navigate("/case-management");
              }}
            >
              <RotateCcw size={17} />
              Customer Requests Return
            </button>

            <button
              className="secondary-delivery-button"
              onClick={() => window.location.reload()}
            >
              <Package size={17} />
              New Delivery
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="delivery-page">

      {/* HEADER */}

      <div className="delivery-header">

        <div>

          <p className="eyebrow">
            DELIVERY EVIDENCE
          </p>

          <h1>
            Capture Original Product
          </h1>

          <p>
            Capture all required angles before handing
            the product to the customer.
          </p>

        </div>

        <div className="delivery-order">

          <span>ORDER</span>

          <strong>
            {order.orderId}
          </strong>

        </div>

      </div>

      {/* ORDER INFO */}

      <div className="delivery-order-card">

        <div className="delivery-product-icon">
          <Package size={22} />
        </div>

        <div>

          <span>
            PRODUCT
          </span>

          <strong>
            {order.product}
          </strong>

          <small>
            {order.category}
          </small>

        </div>

        <div className="delivery-price">

          <span>
            ORDER VALUE
          </span>

          <strong>
            {order.value}
          </strong>

        </div>

      </div>

      {/* MAIN */}

      <div className="delivery-layout">

        {/* CAMERA */}

        <section className="delivery-camera-card">

          <div className="camera-header">

            <div>

              <p className="eyebrow">
                LIVE CAPTURE
              </p>

              <h2>
                {angles[currentAngle]} View
              </h2>

            </div>

            <div className="camera-live">
              <span></span>
              LIVE
            </div>

          </div>

          <div className="camera-container">

            {cameraError ? (

              <div className="camera-error">

                <Camera size={35} />

                <strong>
                  Camera unavailable
                </strong>

                <p>
                  {cameraError}
                </p>

                <button
                  onClick={startCamera}
                >
                  Try Again
                </button>

              </div>

            ) : (

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />

            )}

            <div className="camera-guide">
              Position the product inside the frame
            </div>

          </div>

          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
          />

          <button
            className="capture-button"
            onClick={capturePhoto}
            disabled={!!cameraError || capturing}
          >

            <span className="capture-button-inner">
              <Camera size={21} />
            </span>

            Capture {angles[currentAngle]}

          </button>

        </section>

        {/* PROGRESS */}

        <aside className="delivery-progress-card">

          <div className="progress-header">

            <div>

              <p className="eyebrow">
                EVIDENCE PROGRESS
              </p>

              <h2>
                {capturedCount} / 6
              </h2>

            </div>

            <span>
              angles
            </span>

          </div>

          <div className="progress-bar">

            <div
              style={{
                width: `${(capturedCount / 6) * 100}%`,
              }}
            ></div>

          </div>

          <div className="angle-list">

            {angles.map((angle, index) => {

              const captured = photos[angle];

              const active =
                index === currentAngle &&
                !captured;

              return (
                <div
                  key={angle}
                  className={`angle-item ${
                    captured
                      ? "captured"
                      : active
                      ? "active"
                      : ""
                  }`}
                >

                  <div className="angle-number">

                    {captured ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      index + 1
                    )}

                  </div>

                  <div>

                    <strong>
                      {angle}
                    </strong>

                    <span>
                      {captured
                        ? "Captured"
                        : active
                        ? "Ready to capture"
                        : "Waiting"}
                    </span>

                  </div>

                  {captured && (
                    <button
                      onClick={() =>
                        retakePhoto(angle)
                      }
                    >
                      <RotateCcw size={13} />
                    </button>
                  )}

                </div>
              );

            })}

          </div>

          {/* DEVICE DATA */}

          <div className="capture-data">

            <div>

              <MapPin size={15} />

              <div>

                <span>GPS</span>

                <strong>
                  Ready
                </strong>

              </div>

            </div>

            <div>

              <Clock3 size={15} />

              <div>

                <span>TIMESTAMP</span>

                <strong>
                  Auto recorded
                </strong>

              </div>

            </div>

          </div>

          <button
            className="complete-delivery-button"
            disabled={capturedCount !== 6}
            onClick={completeDelivery}
          >
            <Lock size={16} />
            Complete Delivery
          </button>

        </aside>

      </div>

    </main>
  );
}

export default DeliveryCapture;