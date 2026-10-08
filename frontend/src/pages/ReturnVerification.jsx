import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Package,
  RotateCcw,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { useNavigate, useSearchParams } from "react-router-dom";
import "./ReturnVerification.css";

const angles = [
  "Front",
  "Back",
  "Left",
  "Right",
  "Top",
  "Bottom",
];

function ReturnVerification() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const caseId = searchParams.get("case");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [returnCase, setReturnCase] = useState(null);

  const [currentAngle, setCurrentAngle] = useState(0);

  const [returnPhotos, setReturnPhotos] = useState({});

  const [cameraError, setCameraError] = useState("");

  const [result, setResult] = useState(null);

  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadCase();
  }, []);

  useEffect(() => {
    if (returnCase && !result) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [returnCase, result]);

  const loadCase = () => {
    const storedCase = localStorage.getItem(
      "swapguard_return_case"
    );

    if (!storedCase) {
      return;
    }

    const parsedCase = JSON.parse(storedCase);

    if (caseId && parsedCase.caseId !== caseId) {
      return;
    }

    setReturnCase(parsedCase);
  };


  /* =========================================
     CAMERA
  ========================================= */

  const startCamera = async () => {
    try {
      setCameraError("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
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
        "Camera access was blocked. Allow camera permission and try again."
      );
    }
  };


  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }
  };


  /* =========================================
     CAPTURE RETURN PHOTO
  ========================================= */

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

    const image =
      canvas.toDataURL(
        "image/jpeg",
        0.85
      );

    const angle =
      angles[currentAngle];

    setReturnPhotos((previous) => ({
      ...previous,

      [angle]: {
        image,

        timestamp:
          new Date().toISOString(),
      },
    }));

    if (
      currentAngle <
      angles.length - 1
    ) {
      setCurrentAngle(
        (previous) =>
          previous + 1
      );
    }
  };


  /* =========================================
     RETAKE
  ========================================= */

  const retakePhoto = (angle) => {
    const index =
      angles.indexOf(angle);

    setCurrentAngle(index);

    setReturnPhotos(
      (previous) => {
        const updated = {
          ...previous,
        };

        delete updated[angle];

        return updated;
      }
    );
  };


  /* =========================================
     IMAGE COMPARISON
  ========================================= */

  const getImageData = (
    imageSource
  ) => {
    return new Promise(
      (resolve, reject) => {
        const image =
          new Image();

        image.onload = () => {
          const canvas =
            document.createElement(
              "canvas"
            );

          const size = 32;

          canvas.width = size;

          canvas.height = size;

          const context =
            canvas.getContext(
              "2d",
              {
                willReadFrequently: true,
              }
            );

          context.drawImage(
            image,
            0,
            0,
            size,
            size
          );

          resolve(
            context.getImageData(
              0,
              0,
              size,
              size
            ).data
          );
        };

        image.onerror =
          reject;

        image.src =
          imageSource;
      }
    );
  };


  const compareImages = async (
  originalImage,
  returnImage
) => {
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;

      image.src = src;
    });
  };

  const original = await loadImage(originalImage);
  const returned = await loadImage(returnImage);

  const SIZE = 64;

  /*
    We compare the CENTER of the image much more heavily.

    Why?

    The product should normally be in the center
    of the delivery/return camera frame.

    This prevents the room/background from
    dominating the score.
  */

  const createImageData = (image, cropRatio) => {
    const canvas = document.createElement("canvas");

    canvas.width = SIZE;
    canvas.height = SIZE;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    const sourceWidth =
      image.naturalWidth * cropRatio;

    const sourceHeight =
      image.naturalHeight * cropRatio;

    const sourceX =
      (image.naturalWidth - sourceWidth) / 2;

    const sourceY =
      (image.naturalHeight - sourceHeight) / 2;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      SIZE,
      SIZE
    );

    return ctx.getImageData(
      0,
      0,
      SIZE,
      SIZE
    ).data;
  };


  /*
    CENTER CROP

    60% of the image is used.

    This removes a large amount of
    irrelevant background.
  */

  const originalCenter =
    createImageData(original, 0.60);

  const returnCenter =
    createImageData(returned, 0.60);


  /*
    FULL IMAGE

    We still keep some full-image information
    because angle/background consistency is useful.
  */

  const originalFull =
    createImageData(original, 1);

  const returnFull =
    createImageData(returned, 1);


  /*
    Calculate pixel difference.
  */

  const calculateDifference = (
    first,
    second
  ) => {

    let totalDifference = 0;

    let count = 0;

    for (
      let i = 0;
      i < first.length;
      i += 4
    ) {

      const r1 = first[i];
      const g1 = first[i + 1];
      const b1 = first[i + 2];

      const r2 = second[i];
      const g2 = second[i + 1];
      const b2 = second[i + 2];


      /*
        RGB difference
      */

      const rgbDifference =
        (
          Math.abs(r1 - r2) +
          Math.abs(g1 - g2) +
          Math.abs(b1 - b2)
        ) / 3;


      /*
        Brightness difference

        This helps detect different
        object shapes/colors.
      */

      const brightness1 =
        (
          r1 * 0.299 +
          g1 * 0.587 +
          b1 * 0.114
        );

      const brightness2 =
        (
          r2 * 0.299 +
          g2 * 0.587 +
          b2 * 0.114
        );

      const brightnessDifference =
        Math.abs(
          brightness1 -
          brightness2
        );


      /*
        Combine both.
      */

      totalDifference +=
        (
          rgbDifference * 0.7 +
          brightnessDifference * 0.3
        );

      count++;
    }

    return (
      totalDifference /
      count
    );
  };


  const centerDifference =
    calculateDifference(
      originalCenter,
      returnCenter
    );

  const fullDifference =
    calculateDifference(
      originalFull,
      returnFull
    );


  /*
    IMPORTANT

    Center/product area = 80%

    Full image/background = 20%
  */

  const weightedDifference =
    centerDifference * 0.80 +
    fullDifference * 0.20;


  /*
    Convert difference into similarity.
  */

  let similarity =
    100 -
    (weightedDifference / 255) *
      100;


  /*
    Extra penalty for strong differences.

    This prevents clearly different
    objects from getting an unrealistically
    high score.
  */

  if (centerDifference > 75) {
    similarity -= 25;
  } else if (centerDifference > 55) {
    similarity -= 15;
  } else if (centerDifference > 40) {
    similarity -= 8;
  }


  similarity = Math.max(
    0,
    Math.min(
      100,
      similarity
    )
  );


  return similarity;
};

const dataUrlToBlob = async (dataUrl) => {
  const response = await fetch(dataUrl);
  return await response.blob();
};

  /* =========================================
     VERIFY RETURN
  ========================================= */

const verifyReturn = async () => {
  if (!returnCase) {
    return;
  }

  // Make sure all 6 return photos are captured
  if (Object.keys(returnPhotos).length !== 6) {
    alert("Please capture all 6 return angles before verification.");
    return;
  }

  setVerifying(true);

  try {
    const originalEvidence = returnCase.originalEvidence;

    const formData = new FormData();

    // ======================================================
    // ANGLE → BACKEND FIELD NAME
    // ======================================================

    const deliveryFieldNames = {
      Front: "delivery_front",
      Back: "delivery_back",
      Left: "delivery_left",
      Right: "delivery_right",
      Top: "delivery_top",
      Bottom: "delivery_bottom",
    };

    const returnFieldNames = {
      Front: "return_front",
      Back: "return_back",
      Left: "return_left",
      Right: "return_right",
      Top: "return_top",
      Bottom: "return_bottom",
    };

    // ======================================================
    // DELIVERY EVIDENCE
    // ======================================================

    for (const angle of angles) {
      const originalPhoto =
        originalEvidence?.photos?.[angle];

      if (!originalPhoto?.image) {
        throw new Error(
          `Missing delivery photo: ${angle}`
        );
      }

      const blob = await dataUrlToBlob(
        originalPhoto.image
      );

      formData.append(
        deliveryFieldNames[angle],
        blob,
        `delivery-${angle.toLowerCase()}.jpg`
      );
    }

    // ======================================================
    // RETURN EVIDENCE
    // ======================================================

    for (const angle of angles) {
      const returnPhoto =
        returnPhotos?.[angle];

      if (!returnPhoto?.image) {
        throw new Error(
          `Missing return photo: ${angle}`
        );
      }

      const blob = await dataUrlToBlob(
        returnPhoto.image
      );

      formData.append(
        returnFieldNames[angle],
        blob,
        `return-${angle.toLowerCase()}.jpg`
      );
    }

    // ======================================================
    // DEBUG
    // ======================================================

    console.log(
      "Sending verification request..."
    );

    for (const [key, value] of formData.entries()) {
      console.log(
        key,
        value instanceof File
          ? value.name
          : value
      );
    }

    // ======================================================
    // SEND TO FASTAPI
    // ======================================================

    const response = await fetch(
      "http://127.0.0.1:8000/verify",
      {
        method: "POST",
        body: formData,
      }
    );

    // ======================================================
    // HANDLE BACKEND ERROR
    // ======================================================

    if (!response.ok) {
      const errorData =
        await response.json().catch(
          () => null
        );

      console.error(
        "SwapGuard backend error:",
        errorData
      );

      let errorMessage =
        "Verification server failed.";

      const detail =
        errorData?.detail;

      if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item) => {
            if (
              typeof item === "string"
            ) {
              return item;
            }

            if (item?.msg) {
              const location =
                Array.isArray(item.loc)
                  ? item.loc.join(" → ")
                  : "";

              return location
                ? `${location}: ${item.msg}`
                : item.msg;
            }

            return JSON.stringify(item);
          })
          .join("\n");
      } else if (
        typeof detail === "string"
      ) {
        errorMessage = detail;
      } else if (
        detail &&
        typeof detail === "object"
      ) {
        errorMessage =
          JSON.stringify(
            detail,
            null,
            2
          );
      }

      throw new Error(
        errorMessage
      );
    }

    // ======================================================
    // READ RESPONSE
    // ======================================================

    const data =
      await response.json();

    console.log(
      "SwapGuard verification result:",
      data
    );

    const verification =
      data?.verification;

    if (!verification) {
      throw new Error(
        "Backend returned no verification result."
      );
    }

    const roundedScore =
      Number(
        verification.final_score || 0
      );

    const comparison =
      verification.angles || [];

    // ======================================================
    // MATCH / MISMATCH
    // ======================================================

    const matched =
      verification.decision === "MATCH";

    const oldAttempts =
      Number(
        returnCase.attempts || 0
      );

    // ======================================================
    // APPROVED
    // ======================================================

    if (matched) {
      const updatedCase = {
        ...returnCase,

        status:
          "Return Approved",

        decision:
          "Approved",

        attempts:
          oldAttempts,

        returnEvidence:
          returnPhotos,

        visualMatch:
          roundedScore,

        comparison,

        verifiedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "swapguard_return_case",
        JSON.stringify(updatedCase)
      );

      setReturnCase(
        updatedCase
      );

      setResult({
        type: "approved",

        score:
          roundedScore,

        comparison,
      });

      stopCamera();

      setVerifying(false);

      return;
    }

    // ======================================================
    // FAILED ATTEMPT
    // ======================================================

    const newAttempts =
      oldAttempts + 1;

    const cancelled =
      newAttempts >= 3;

    const updatedCase = {
      ...returnCase,

      status: cancelled
        ? "Return Cancelled"
        : "Verification Failed",

      decision: cancelled
        ? "Cancelled"
        : null,

      attempts:
        newAttempts,

      returnEvidence:
        returnPhotos,

      visualMatch:
        roundedScore,

      comparison,

      lastAttemptAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "swapguard_return_case",
      JSON.stringify(updatedCase)
    );

    setReturnCase(
      updatedCase
    );

    setResult({
      type: cancelled
        ? "cancelled"
        : "failed",

      score:
        roundedScore,

      attempt:
        newAttempts,

      comparison,
    });

    stopCamera();

    setVerifying(false);

  } catch (error) {
    console.error(
      "SwapGuard verification error:",
      error
    );

    const message =
      error?.message ||
      "Image verification failed.";

    alert(
      "Verification failed:\n\n" +
      message
    );

  } finally {
    setVerifying(false);
  }
};
  /* =========================================
     RESET FOR NEXT ATTEMPT
  ========================================= */

  const startNextAttempt = async () => {
    setReturnPhotos({});

    setCurrentAngle(0);

    setResult(null);

    await startCamera();
  };


  /* =========================================
     NO CASE
  ========================================= */

  if (!returnCase) {
    return (
      <main className="return-page">

        <div className="return-empty">

          <XCircle size={40} />

          <h1>
            Return case not found
          </h1>

          <p>
            Open a valid return case from
            Case Management.
          </p>

          <button
            onClick={() =>
              navigate(
                "/case-management"
              )
            }
          >
            Back to Case Management
          </button>

        </div>

      </main>
    );
  }


  /* =========================================
     RESULT SCREEN
  ========================================= */

  if (result) {
    const approved =
      result.type ===
      "approved";

    const cancelled =
      result.type ===
      "cancelled";

    return (
      <main className="return-page">

        <div
          className={`verification-result ${
            approved
              ? "result-approved"
              : cancelled
              ? "result-cancelled"
              : "result-failed"
          }`}
        >

          <div className="result-icon">

            {approved ? (
              <CheckCircle2 size={38} />
            ) : (
              <XCircle size={38} />
            )}

          </div>


          <p className="eyebrow">
            RETURN VERIFICATION
          </p>


          <h1>

            {approved &&
              "Return Approved"}

            {cancelled &&
              "Return Cancelled"}

            {!approved &&
              !cancelled &&
              "Product Mismatch"}

          </h1>


          <p className="result-description">

            {approved &&
              "The returned product matches the original delivery evidence."}

            {cancelled &&
              "The returned product could not be verified after 3 attempts."}

            {!approved &&
              !cancelled &&
              "The return evidence does not sufficiently match the original delivery evidence."}

          </p>


          <div className="result-score">

            <span>
              VISUAL MATCH
            </span>

            <strong>
              {result.score}%
            </strong>

          </div>


          <div className="result-meta">

            <div>

              <span>
                CASE
              </span>

              <strong>
                {returnCase.caseId}
              </strong>

            </div>

            <div>

              <span>
                ANGLES
              </span>

              <strong>
                6 / 6
              </strong>

            </div>

            <div>

              <span>
                ATTEMPTS
              </span>

              <strong>
                {returnCase.attempts} / 3
              </strong>

            </div>

          </div>


          {!approved &&
            !cancelled && (

              <button
                className="retry-verification-button"
                onClick={
                  startNextAttempt
                }
              >
                <RotateCcw size={17} />
                Retake Photos
              </button>

            )}


          {approved && (

            <button
              className="retry-verification-button"
              onClick={() =>
                navigate(
                  "/case-management"
                )
              }
            >
              <CheckCircle2 size={17} />
              Back to Case Management
            </button>

          )}


          {cancelled && (

            <button
              className="retry-verification-button"
              onClick={() =>
                navigate(
                  "/case-management"
                )
              }
            >
              <Lock size={17} />
              View Case
            </button>

          )}

        </div>

      </main>
    );
  }


  const capturedCount =
    Object.keys(
      returnPhotos
    ).length;

  return (
    <main className="return-page">

      {/* HEADER */}

      <div className="return-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate(
                "/case-management"
              )
            }
          >
            <ArrowLeft size={16} />
            Back to Case Management
          </button>

          <p className="eyebrow">
            RETURN VERIFICATION
          </p>

          <h1>
            Verify Returned Product
          </h1>

          <p>
            Capture the same angles used during
            the original delivery.
          </p>

        </div>


        <div className="return-case-badge">

          <span>
            CASE
          </span>

          <strong>
            {returnCase.caseId}
          </strong>

        </div>

      </div>


      {/* CASE INFO */}

      <div className="return-case-info">

        <div className="return-product">

          <div className="return-product-icon">
            <Package size={21} />
          </div>

          <div>

            <span>
              PRODUCT
            </span>

            <strong>
              {returnCase.product}
            </strong>

            <small>
              Order #{returnCase.orderId}
            </small>

          </div>

        </div>


        <div className="attempt-display">

          <span>
            VERIFICATION ATTEMPTS
          </span>

          <strong>
            {returnCase.attempts} / 3
          </strong>

        </div>

      </div>


      {/* MAIN */}

      <div className="return-layout">

        {/* CAMERA */}

        <section className="return-camera-card">

          <div className="return-camera-header">

            <div>

              <p className="eyebrow">
                RETURN CAPTURE
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


          <div className="return-camera">

            {cameraError ? (

              <div className="return-camera-error">

                <Camera size={34} />

                <strong>
                  Camera unavailable
                </strong>

                <p>
                  {cameraError}
                </p>

                <button
                  onClick={
                    startCamera
                  }
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
              Match the product position from delivery
            </div>

          </div>


          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />


          <button
            className="return-capture-button"
            onClick={
              capturePhoto
            }
            disabled={
              !!cameraError
            }
          >

            <Camera size={20} />

            Capture{" "}
            {angles[currentAngle]}

          </button>

        </section>


        {/* SIDE */}

        <aside className="return-progress-card">

          <div className="return-progress-header">

            <div>

              <p className="eyebrow">
                RETURN EVIDENCE
              </p>

              <h2>
                {capturedCount} / 6
              </h2>

            </div>

          </div>


          <div className="return-progress-bar">

            <div
              style={{
                width: `${
                  (capturedCount / 6) *
                  100
                }%`,
              }}
            />

          </div>


          <div className="return-angle-list">

            {angles.map(
              (
                angle,
                index
              ) => {

                const captured =
                  returnPhotos[
                    angle
                  ];

                const active =
                  index ===
                    currentAngle &&
                  !captured;

                return (
                  <div
                    key={angle}
                    className={`return-angle ${
                      captured
                        ? "captured"
                        : active
                        ? "active"
                        : ""
                    }`}
                  >

                    <div className="return-angle-number">

                      {captured ? (
                        <CheckCircle2
                          size={15}
                        />
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
                          ? "Ready"
                          : "Waiting"}
                      </span>

                    </div>

                    {captured && (
                      <button
                        onClick={() =>
                          retakePhoto(
                            angle
                          )
                        }
                      >
                        <RotateCcw
                          size={13}
                        />
                      </button>
                    )}

                  </div>
                );
              }
            )}

          </div>


          {/* ORIGINAL EVIDENCE */}

          <div className="original-proof">

            <ShieldCheck
              size={18}
            />

            <div>

              <strong>
                Original evidence locked
              </strong>

              <span>
                6 delivery photos available
              </span>

            </div>

          </div>


          <button
            className="verify-return-button"
            disabled={
              capturedCount !== 6 ||
              verifying
            }
            onClick={
              verifyReturn
            }
          >

            {verifying
              ? "Comparing Evidence..."
              : "Verify Return"}

          </button>

        </aside>

      </div>

    </main>
  );
}

export default ReturnVerification;