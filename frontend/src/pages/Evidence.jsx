import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPin,
  Clock3,
  ShieldCheck,
  RotateCcw,
  Lock,
} from "lucide-react";
import "./Evidence.css";

const captureAngles = [
  "Front",
  "Back",
  "Left Side",
  "Right Side",
  "Top",
  "Bottom",
];

function Evidence() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [captures, setCaptures] = useState([]);
  const [error, setError] = useState("");

  const [timestamp, setTimestamp] = useState(
    new Date().toLocaleString("en-IN")
  );

  const currentCase = JSON.parse(
    localStorage.getItem("swapguard_current_case") || "{}"
  );

  useEffect(() => {
    startCamera();

    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString("en-IN"));
    }, 1000);

    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not supported by this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);
    } catch (err) {
      console.error(err);
      setError(
        "Camera permission was denied or the camera is unavailable."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !cameraActive) {
      return;
    }

    const video = videoRef.current;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image = canvas.toDataURL("image/jpeg", 0.85);

    const newCapture = {
      angle: captureAngles[currentAngle],
      image,
      timestamp: new Date().toISOString(),
      gps: "Demo GPS captured",
      marker: `SG-MARKER-${currentAngle + 1}`,
    };

    setCaptures((previous) => [...previous, newCapture]);

    if (currentAngle < captureAngles.length - 1) {
      setCurrentAngle((previous) => previous + 1);
    }
  };

  const resetCapture = () => {
    setCaptures([]);
    setCurrentAngle(0);
  };

  const finishCapture = () => {
    if (captures.length !== captureAngles.length) {
      alert(
        `Please capture all ${captureAngles.length} required angles.`
      );
      return;
    }

    const evidence = {
      caseId: currentCase.caseId,
      stage: "delivery",
      captures,
      capturedAt: new Date().toISOString(),
      status: "completed",
    };

    localStorage.setItem(
      "swapguard_delivery_evidence",
      JSON.stringify(evidence)
    );

    navigate("/return-verification");
  };

  const progress =
    (captures.length / captureAngles.length) * 100;

  return (
    <main className="evidence-page">

      {/* Header */}

      <div className="evidence-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/investigation")}
          >
            <ArrowLeft size={17} />
            Back to Investigation
          </button>

          <p className="eyebrow">
            STEP 1 OF 4
          </p>

          <h1>Delivery Evidence Capture</h1>

          <p>
            Capture the original product from every required angle.
          </p>
        </div>

        <div className="evidence-case-id">
          <span>CASE</span>
          <strong>
            {currentCase.caseId || "SG-DEMO"}
          </strong>
        </div>

      </div>


      {/* Progress */}

      <div className="capture-progress">

        <div className="progress-info">
          <span>
            Capture Progress
          </span>

          <strong>
            {captures.length} / {captureAngles.length}
          </strong>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

      </div>


      {/* Main */}

      <div className="evidence-layout">

        {/* Camera */}

        <section className="camera-card">

          <div className="camera-header">

            <div>
              <span className="live-indicator">
                <span></span>
                LIVE CAPTURE
              </span>

              <h2>
                {captureAngles[currentAngle]}
              </h2>
            </div>

            <div className="camera-security">
              <Lock size={14} />
              Gallery disabled
            </div>

          </div>


          <div className="camera-frame">

            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="camera-placeholder">
                <Camera size={45} />

                <strong>
                  Camera unavailable
                </strong>

                <span>
                  Enable camera access to continue.
                </span>

                <button
                  onClick={startCamera}
                  className="retry-camera"
                >
                  <RotateCcw size={15} />
                  Try Camera Again
                </button>
              </div>
            )}

            <div className="camera-overlay">

              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>

              <div className="capture-guide">
                Position product inside the frame
              </div>

            </div>

          </div>


          {error && (
            <div className="camera-error">
              {error}
            </div>
          )}


          <div className="camera-controls">

            <button
              className="capture-button"
              onClick={captureImage}
              disabled={!cameraActive}
            >
              <Camera size={21} />
              Capture {captureAngles[currentAngle]}
            </button>

          </div>

        </section>


        {/* Evidence Panel */}

        <aside className="evidence-panel">

          <div className="panel-card">

            <div className="panel-title">
              <ShieldCheck size={18} />

              <div>
                <strong>
                  Evidence Integrity
                </strong>

                <span>
                  Protected capture session
                </span>
              </div>
            </div>


            <div className="metadata-row">
              <MapPin size={15} />

              <div>
                <small>LOCATION</small>
                <strong>Bengaluru, India</strong>
              </div>
            </div>


            <div className="metadata-row">
              <Clock3 size={15} />

              <div>
                <small>TIMESTAMP</small>
                <strong>{timestamp}</strong>
              </div>
            </div>


            <div className="metadata-row">
              <Lock size={15} />

              <div>
                <small>CAPTURE MODE</small>
                <strong>Live camera only</strong>
              </div>
            </div>

          </div>


          <div className="angles-card">

            <div className="angles-header">
              <strong>Required Angles</strong>

              <span>
                {captures.length}/{captureAngles.length}
              </span>
            </div>


            <div className="angle-list">

              {captureAngles.map((angle, index) => {

                const captured = captures.some(
                  (capture) => capture.angle === angle
                );

                const active =
                  index === currentAngle && !captured;

                return (
                  <div
                    key={angle}
                    className={`angle-item ${
                      captured ? "captured" : ""
                    } ${active ? "active" : ""}`}
                  >

                    <div className="angle-number">
                      {captured ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span>{angle}</span>

                    {captured && (
                      <small>Captured</small>
                    )}

                  </div>
                );
              })}

            </div>

          </div>


          <button
            className="finish-capture"
            onClick={finishCapture}
            disabled={
              captures.length !== captureAngles.length
            }
          >
            Complete Delivery Capture
          </button>


          <button
            className="reset-capture"
            onClick={resetCapture}
          >
            <RotateCcw size={15} />
            Reset captures
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Evidence;