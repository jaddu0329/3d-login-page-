import { useEffect, useState } from "react";
import { signInWithGoogle, signInWithGithub, signInWithApple } from "./auth/providers";
import "./App.css";
import Scene3D from "./components/Scene3D";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [mountSpline, setMountSpline] = useState(false);
  const [enableSplineInteractions, setEnableSplineInteractions] = useState(false);
  const [btnAnimating, setBtnAnimating] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mood, setMood] = useState("neutral");
  const [credentialError, setCredentialError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [errorNonce, setErrorNonce] = useState(0);
  const [errorAnim, setErrorAnim] = useState(false);

  // Sign up modal
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpEmailOrPhone, setSignUpEmailOrPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpRePassword, setSignUpRePassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpRePassword, setShowSignUpRePassword] = useState(false);
  const [signUpError, setSignUpError] = useState("");

  // Demo-only: replace with real auth backend.
  // You can override via Vite env: VITE_DEMO_PASSWORD
  const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? "Password@123";

  const pulseMood = (nextMood, ms = 800) => {
    setMood(nextMood);
    window.clearTimeout(pulseMood._t);
    pulseMood._t = window.setTimeout(() => setMood("neutral"), ms);
  };

  const triggerLoginError = (message = "Incorrect email or password") => {
    setPasswordError(message);
    setErrorNonce((n) => n + 1);

    // Eye reaction: short confused glance
    pulseMood("confused", 900);

    // One cohesive animation window
    setErrorAnim(true);
    window.clearTimeout(triggerLoginError._t);
    triggerLoginError._t = window.setTimeout(() => setErrorAnim(false), 620);
  };

  const validateEmailOrPhone = (value) => {
    const raw = (value || "").trim();
    if (!raw) return "Please enter Email/Phone";

    const digitsOnly = /^\d+$/.test(raw);
    if (digitsOnly) {
      return raw.length === 10 ? "" : "Phone number must be 10 digits";
    }

    // Basic email validation: must contain @ and a dot in the domain part
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw);
    return emailOk ? "" : "Enter a valid email (example@domain.com) or a 10-digit phone";
  };

  useEffect(() => {
    // Trigger fast entrance animation after first paint
    const t = requestAnimationFrame(() => setIsReady(true));

    // Splash screen: show immediately, fade out after ~1.2s, then mount Spline.
    const fadeT = window.setTimeout(() => setSplashFading(true), 1200);
    const unmountT = window.setTimeout(() => {
      setShowSplash(false);
      setMountSpline(true);
    }, 1200 + 520);

    return () => {
      cancelAnimationFrame(t);
      window.clearTimeout(fadeT);
      window.clearTimeout(unmountT);
    };
  }, []);

  useEffect(() => {
    if (!showSignUp) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowSignUp(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSignUp]);

  const resetSignUp = () => {
    setSignUpFirstName("");
    setSignUpLastName("");
    setSignUpEmailOrPhone("");
    setSignUpPassword("");
    setSignUpRePassword("");
    setShowSignUpPassword(false);
    setShowSignUpRePassword(false);
    setSignUpError("");
  };

  const openSignUp = () => {
    resetSignUp();
    setShowSignUp(true);
  };

  const submitSignUp = (e) => {
    e.preventDefault();

    if (!signUpFirstName.trim()) {
      setSignUpError("Please enter first name");
      return;
    }
    if (!signUpLastName.trim()) {
      setSignUpError("Please enter last name");
      return;
    }

    const err = validateEmailOrPhone(signUpEmailOrPhone);
    if (err) {
      setSignUpError(err);
      return;
    }

    if (!signUpPassword.trim()) {
      setSignUpError("Please enter password");
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError("Password must be at least 6 characters");
      return;
    }

    if (signUpRePassword !== signUpPassword) {
      setSignUpError("Passwords do not match");
      return;
    }

    setSignUpError("");
    // Demo-only: no backend. Close modal and prefill login fields.
    setEmailOrPhone(signUpEmailOrPhone.trim());
    setPassword("");
    setShowPassword(false);
    setShowSignUp(false);
    alert("Account created (demo). Now login with your password.");
  };

  const EyeIcon = ({ off = false }) =>
    off ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.88 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.76 18.76 0 0 1-3.09 4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.11 6.11A18.76 18.76 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 2.12-.21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.12 14.12A3 3 0 0 1 9.88 9.88"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <div className={`app ${isReady ? "is-ready" : ""}`}>
      {showSplash ? <SplashScreen isFading={splashFading} /> : null}

      {mountSpline ? (
        <Scene3D
          enableInteractions={enableSplineInteractions}
          onMainReady={() => setEnableSplineInteractions(true)}
        />
      ) : null}

      {isLoggedIn ? (
        <div className="success-screen" role="status" aria-live="polite">
          <div className="success-card">
            <div className="success-title">Login is successfully done</div>
          </div>
        </div>
      ) : (
        /* Login Card */
        <div className="login-card">
          <div className={`card-anim ${errorAnim ? "card-error" : ""}`}>
            <div className={errorAnim ? "card-shell card-shell-error" : "card-shell"}>
              <h2>Welcome Back</h2>

          <div className="field">
            <input
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Email/Phone"
              value={emailOrPhone}
              className={credentialError ? "input-error" : ""}
              onFocus={() => pulseMood("smile")}
              onBlur={() => setCredentialError(validateEmailOrPhone(emailOrPhone))}
              onChange={(e) => {
                const next = e.target.value;
                setEmailOrPhone(next);
                pulseMood("smile");
                if (credentialError) {
                  setCredentialError(validateEmailOrPhone(next));
                }
                if (passwordError) setPasswordError("");
              }}
            />
            {credentialError ? <div className="field-error">{credentialError}</div> : null}
          </div>
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onFocus={() => pulseMood("smile")}
              onChange={(e) => {
                setPassword(e.target.value);
                pulseMood("smile");
                if (passwordError) setPasswordError("");
              }}
            />
            <button
              type="button"
              className="toggle-visibility"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => {
                const next = !showPassword;
                setShowPassword(next);
                if (next) {
                  // Show password -> eyes look away / hide
                  setMood("hide");
                } else {
                  // Hide password -> back to a subtle smile
                  pulseMood("smile");
                }
              }}
            >
              {showPassword ? (
                // eye-off
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.58 10.58a2 2 0 0 0 2.83 2.83"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.88 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.76 18.76 0 0 1-3.09 4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.11 6.11A18.76 18.76 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 2.12-.21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.12 14.12A3 3 0 0 1 9.88 9.88"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // eye
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {passwordError ? (
            <div key={errorNonce} className="inline-error" role="alert">
              {passwordError}
            </div>
          ) : null}

            <button
              className={`primary-button ${btnAnimating ? "animating" : ""} ${errorAnim ? "is-error" : ""}`}
              onClick={() => {
                const err = validateEmailOrPhone(emailOrPhone);
                setCredentialError(err);
                if (err) {
                  triggerLoginError("Enter a valid Email/Phone");
                  return;
                }

                if (!password.trim()) {
                  triggerLoginError("Please enter password");
                  return;
                }

                // Demo: show cohesive error interaction when password is incorrect.
                if (password !== DEMO_PASSWORD) {
                  triggerLoginError("Incorrect email or password");
                  return;
                }

                // Trigger smooth press animation
                setBtnAnimating(true);
                setTimeout(() => setBtnAnimating(false), 600);
                // Happy reaction on login
                pulseMood("happy", 1200);
                // Navigate to success screen
                setTimeout(() => setIsLoggedIn(true), 250);
              }}
            >
              Login
            </button>

          <div className="social-divider">
            <span>or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-button google" onClick={signInWithGoogle}>
              <img className="icon-img" src="https://cdn.simpleicons.org/google/ffffff" alt="" aria-hidden="true" />
              <span className="label">Login with Google</span>
            </button>
            <button className="social-button github" onClick={signInWithGithub}>
              <img className="icon-img" src="https://cdn.simpleicons.org/github/ffffff" alt="" aria-hidden="true" />
              <span className="label">Login with GitHub</span>
            </button>
            <button className="social-button apple" onClick={signInWithApple}>
              <img className="icon-img" src="https://cdn.simpleicons.org/apple/ffffff" alt="" aria-hidden="true" />
              <span className="label">Login with Apple</span>
            </button>
          </div>

          <p>
            Don’t have an account?{" "}
            <span
              className="cta-link"
              role="button"
              tabIndex={0}
              onClick={openSignUp}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openSignUp();
              }}
            >
              Sign up
            </span>
          </p>
            </div>
          </div>
        </div>
      )}

      {showSignUp ? (
        <div
          className="auth-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Sign up"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) setShowSignUp(false);
          }}
        >
          <div className="auth-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="auth-modal__header">
              <div>
                <div className="auth-modal__title">Create account</div>
                <div className="auth-modal__subtitle">Fill the details to sign up</div>
              </div>
              <button
                type="button"
                className="auth-modal__close"
                aria-label="Close"
                onClick={() => setShowSignUp(false)}
              >
                ×
              </button>
            </div>

            <form className="auth-modal__form" onSubmit={submitSignUp}>
              <div className="auth-modal__grid">
                <div className="auth-field">
                  <label>First name</label>
                  <input
                    value={signUpFirstName}
                    onChange={(e) => setSignUpFirstName(e.target.value)}
                    autoComplete="given-name"
                    placeholder="First name"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label>Last name</label>
                  <input
                    value={signUpLastName}
                    onChange={(e) => setSignUpLastName(e.target.value)}
                    autoComplete="family-name"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Email / Phone</label>
                <input
                  value={signUpEmailOrPhone}
                  onChange={(e) => setSignUpEmailOrPhone(e.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  placeholder="Email or 10-digit phone"
                  required
                />
              </div>

              <div className="auth-field auth-password">
                <label>Password</label>
                <div className="auth-password__row">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password__toggle"
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowSignUpPassword((v) => !v)}
                  >
                    <EyeIcon off={showSignUpPassword} />
                  </button>
                </div>
              </div>

              <div className="auth-field auth-password">
                <label>Re-enter password</label>
                <div className="auth-password__row">
                  <input
                    type={showSignUpRePassword ? "text" : "password"}
                    value={signUpRePassword}
                    onChange={(e) => setSignUpRePassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-password__toggle"
                    aria-label={showSignUpRePassword ? "Hide password" : "Show password"}
                    onClick={() => setShowSignUpRePassword((v) => !v)}
                  >
                    <EyeIcon off={showSignUpRePassword} />
                  </button>
                </div>
              </div>

              {signUpError ? (
                <div className="auth-modal__error" role="alert">
                  {signUpError}
                </div>
              ) : null}

              <div className="auth-modal__actions">
                <button type="button" className="auth-modal__secondary" onClick={() => setShowSignUp(false)}>
                  Cancel
                </button>
                <button type="submit" className="auth-modal__primary">
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
