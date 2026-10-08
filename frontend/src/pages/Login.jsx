import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Box,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const VerificationScene = lazy(() => import("./VerificationScene"));

class SceneBoundary extends Component {
  state = { failed: false };

static getDerivedStateFromError() {
    return { failed: true };
  }

render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function SceneFallback() {
  return (
    <div className="sg-scene-fallback">
      <div className="sg-fallback-orbit" />
      <div className="sg-fallback-box">
        <Box size={84} strokeWidth={1} />
      </div>
    </div>
  );
}

function useSceneActivity(ref) {
  const [active, setActive] = useState(false);

useEffect(() => {
    const element = ref.current;
    if (!element) return;

const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inViewport = true;

const update = () => {
      setActive(
        inViewport &&
          document.visibilityState === "visible" &&
          !motion.matches
      );
    };

const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        update();
      },
      { threshold: 0.05 }
    );

observer.observe(element);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    update();

return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, [ref]);

return active;
}

/**
 * onAuthenticate({ email, password }) must resolve only after
 * successful server-side authentication and reject on failure.
 *
 * Without it, this page operates in explicitly labelled demo mode.
 */
export default function Login({ onAuthenticate }) {
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const submitting = useRef(false);
  const mounted = useRef(false);

const animate = useSceneActivity(sceneRef);

const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

const demoMode = typeof onAuthenticate !== "function";

useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

async function handleLogin(event) {
    event.preventDefault();
    if (submitting.current) return;

setError("");

if (demoMode) {
      navigate("/dashboard");
      return;
    }

const form = new FormData(event.currentTarget);

submitting.current = true;
    setLoggingIn(true);

try {
      await onAuthenticate({
        email: String(form.get("email") || "").trim(),
        password: String(form.get("password") || ""),
      });

if (mounted.current) {
        navigate("/", { replace: true });
      }
    } catch {
      if (mounted.current) {
        setError("Unable to sign in. Check your details and try again.");
      }
    } finally {
      submitting.current = false;
      if (mounted.current) setLoggingIn(false);
    }
  }

return (
    <main className="sg-login">
      <div className="sg-ambient" aria-hidden="true" />

<header className="sg-header">
        <a className="sg-brand" href="/" aria-label="SwapGuard home">
          <span className="sg-brand-mark">
            <ShieldCheck size={23} aria-hidden="true" />
          </span>

<span>
            <strong>SWAPGUARD</strong>
            <small>RETURN VERIFICATION PLATFORM</small>
          </span>
        </a>

<span className="sg-header-note">Evidence before assumptions.</span>
      </header>

<div className="sg-layout">
        <section className="sg-story" aria-labelledby="sg-title">
          <div className="sg-eyebrow">
            <span />
            TRUST EVERY RETURN
          </div>

<h1 id="sg-title">
            Every package.
            <br />
            <span>Proof in every detail.</span>
          </h1>

<p className="sg-description">
            Connect the original delivery evidence with the returned
            product. Investigate with clarity, not guesswork.
          </p>

<div className="sg-stage" ref={sceneRef} aria-hidden="true">
            <div className="sg-stage-grid" />

<div className="sg-scene">
              <SceneBoundary fallback={<SceneFallback />}>
                <Suspense fallback={<SceneFallback />}>
                  <VerificationScene animate={animate} />
                </Suspense>
              </SceneBoundary>
            </div>

<div className="sg-scene-caption sg-caption-top">
              <span className="sg-status-dot" />
              VERIFICATION VISUALIZATION
            </div>

<div className="sg-evidence-card">
              <span className="sg-evidence-icon">
                <ShieldCheck size={19} />
              </span>
              <div>
                <strong>Visual fingerprint</strong>
                <span>Compare. Investigate. Verify.</span>
              </div>
              <span className="sg-card-index">01</span>
            </div>

<span className="sg-coordinate">SG / EVIDENCE ENGINE</span>
          </div>
        </section>

<section className="sg-panel" aria-labelledby="sg-login-title">
          <div className="sg-panel-inner">
            <div className="sg-panel-top">
              <span className="sg-panel-icon">
                <ShieldCheck size={25} aria-hidden="true" />
              </span>
              <span className="sg-access-label">INVESTIGATOR ACCESS</span>
            </div>

<h2 id="sg-login-title">Welcome back.</h2>

<p className="sg-panel-description">
              Sign in to investigate return cases and review product
              authenticity.
            </p>

<form onSubmit={handleLogin} aria-busy={loggingIn}>
              <div className="sg-field">
                <label htmlFor="sg-email">Email address</label>
                <input
                  id="sg-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  placeholder="investigator@swapguard.com"
                  required={!demoMode}
                  disabled={loggingIn}
                />
              </div>

<div className="sg-field">
                <div className="sg-password-heading">
                  <label htmlFor="sg-password">Password</label>

<button
                    className="sg-password-toggle"
                    type="button"
                    aria-controls="sg-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? (
                      <EyeOff size={15} aria-hidden="true" />
                    ) : (
                      <Eye size={15} aria-hidden="true" />
                    )}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

<input
                  id="sg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required={!demoMode}
                  disabled={loggingIn}
                  aria-describedby={error ? "sg-login-error" : undefined}
                />
              </div>

{error && (
                <p id="sg-login-error" className="sg-error" role="alert">
                  {error}
                </p>
              )}

<button
                className="sg-submit"
                type="submit"
                disabled={loggingIn}
              >
                <span aria-live="polite">
                  {loggingIn
                    ? "Signing in…"
                    : demoMode
                      ? "Explore demo"
                      : "Enter platform"}
                </span>

{loggingIn ? (
                  <span className="sg-spinner" aria-hidden="true" />
                ) : (
                  <ArrowRight size={18} aria-hidden="true" />
                )}
              </button>

{demoMode && (
                <p className="sg-demo-note">
                  UI demo — authentication is not connected.
                  Do not enter real credentials.
                </p>
              )}
            </form>

<div className="sg-panel-footer">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>Built for evidence-led investigations</span>
            </div>
          </div>
        </section>
      </div>

<footer className="sg-footer">
        <span>01 / Delivery evidence</span>
        <span>02 / Visual fingerprint</span>
        <span>03 / Return verification</span>
      </footer>
    </main>
  );
}
