import { useEffect, useState } from "react";
import { signInWithGoogle, signInWithGithub, signInWithApple } from "./auth/providers";
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
    <div className={"premium-bg grid-texture min-h-[100svh] w-screen overflow-x-hidden" + (isReady ? "" : "")}>
      {showSplash ? <SplashScreen isFading={splashFading} /> : null}

      <main className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-8 md:py-10 lg:gap-12 lg:px-8">
        {/* 3D Section */}
        <section className="flex min-h-[45svh] w-full flex-col justify-center md:min-h-0 md:basis-3/5" aria-label="3D system illustration">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full">
              <div className="mx-auto aspect-video w-full max-w-[980px] transform-gpu scale-[0.92] transition-transform duration-500 ease-out sm:scale-100">
                <div className="h-full w-full rounded-[24px] border border-white/10 bg-white/[0.03] shadow-[0_40px_110px_rgba(0,0,0,0.62),0_0_70px_rgba(255,122,0,0.14)] ring-1 ring-white/10">
                  {mountSpline ? (
                    <Scene3D
                      enableInteractions={enableSplineInteractions}
                      onMainReady={() => setEnableSplineInteractions(true)}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="flex min-h-[55svh] w-full flex-col justify-center md:min-h-0 md:basis-2/5" aria-label="Authentication">
          {isLoggedIn ? (
            <div role="status" aria-live="polite" className="flex w-full items-center justify-center">
              <div className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-7">
                <div className="text-center text-[clamp(1.05rem,1.4vw,1.2rem)] font-semibold text-white/90">
                  Login is successfully done
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[460px]">
              <div
                className={
                  "rounded-2xl border bg-white/[0.06] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-300 sm:p-7 " +
                  (errorAnim ? "border-rose-400/30 ring-1 ring-rose-400/15" : "border-white/10 ring-1 ring-white/10")
                }
              >
                <header className="mb-7">
                  <h1 className="text-[clamp(1.5rem,2.3vw,2rem)] font-semibold tracking-tight text-white/95 leading-tight">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-[clamp(0.93rem,1.2vw,1.02rem)] text-white/65">
                    Sign in to continue
                  </p>
                </header>

                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wide text-white/70">Email / Phone</label>
                    <input
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      placeholder="Email or 10-digit phone"
                      value={emailOrPhone}
                      className={
                          "h-12 w-full rounded-xl border bg-black/20 px-4 text-[clamp(0.95rem,1.05vw,1rem)] text-white/90 placeholder:text-white/40 shadow-sm outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25 " +
                        (credentialError ? "border-rose-400/35 focus:border-rose-400/35 focus:ring-rose-400/20" : "border-white/10")
                      }
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
                    {credentialError ? (
                      <p className="text-sm text-rose-200/90" role="alert">
                        {credentialError}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium tracking-wide text-white/70">Password</label>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        className={
                          "h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-[clamp(0.95rem,1.05vw,1rem)] text-white/90 placeholder:text-white/40 shadow-sm outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                        }
                        onFocus={() => pulseMood("smile")}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          pulseMood("smile");
                          if (passwordError) setPasswordError("");
                        }}
                      />
                      <button
                        type="button"
                        className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 shadow-sm outline-none transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400/25"
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
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mx-auto">
                            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.88 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.76 18.76 0 0 1-3.09 4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.11 6.11A18.76 18.76 0 0 0 2 12s3 7 10 7a10.94 10.94 0 0 0 2.12-.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mx-auto">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {passwordError ? (
                      <p key={errorNonce} className="text-sm text-rose-200/90" role="alert">
                        {passwordError}
                      </p>
                    ) : null}
                  </div>

                  <div className="-mt-1 flex items-center justify-between gap-3 text-sm">
                    <label className="inline-flex items-center gap-2 text-white/70 select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 accent-orange-400 outline-none focus-visible:ring-2 focus-visible:ring-orange-400/25"
                      />
                      <span>Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-white/65 underline underline-offset-4 decoration-white/20 transition hover:text-white/85 hover:decoration-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/25 rounded"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="button"
                    className={
                      "mt-1 h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 px-5 text-[clamp(0.98rem,1.05vw,1.05rem)] font-semibold text-[#14110b] shadow-[0_12px_28px_rgba(255,122,0,0.22)] outline-none transition hover:brightness-110 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-300/35 " +
                      (btnAnimating ? "ring-1 ring-orange-300/25" : "")
                    }
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

                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs font-medium tracking-wide text-white/55">or continue with</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/90 shadow-sm outline-none transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-400/20"
                      onClick={signInWithGoogle}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <img src="https://cdn.simpleicons.org/google/ffffff" alt="" aria-hidden="true" className="h-4 w-4" />
                        <span className="sm:hidden">Continue with Google</span>
                        <span className="hidden sm:inline">Google</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/90 shadow-sm outline-none transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-400/20"
                      onClick={signInWithGithub}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <img src="https://cdn.simpleicons.org/github/ffffff" alt="" aria-hidden="true" className="h-4 w-4" />
                        <span className="sm:hidden">Continue with GitHub</span>
                        <span className="hidden sm:inline">GitHub</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/90 shadow-sm outline-none transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-400/20"
                      onClick={signInWithApple}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <img src="https://cdn.simpleicons.org/apple/ffffff" alt="" aria-hidden="true" className="h-4 w-4" />
                        <span className="sm:hidden">Continue with Apple</span>
                        <span className="hidden sm:inline">Apple</span>
                      </span>
                    </button>
                  </div>

                  <p className="pt-1 text-sm text-white/70">
                    Don’t have an account?{" "}
                    <span
                      className="cursor-pointer font-semibold text-amber-300 transition hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/25 rounded"
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
                </form>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Sign up modal */}
      {showSignUp ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Sign up"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget) setShowSignUp(false);
          }}
        >
          <div
            className="w-full max-w-[540px] rounded-2xl border border-white/10 bg-white/[0.07] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.60)] backdrop-blur-xl sm:p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-white/95">Create account</div>
                <div className="mt-1 text-sm text-white/60">Fill the details to sign up</div>
              </div>
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] text-xl leading-none text-white/80 outline-none transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400/25"
                aria-label="Close"
                onClick={() => setShowSignUp(false)}
              >
                ×
              </button>
            </div>

            <form className="flex flex-col gap-5" onSubmit={submitSignUp}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium tracking-wide text-white/70">First name</label>
                  <input
                    value={signUpFirstName}
                    onChange={(e) => setSignUpFirstName(e.target.value)}
                    autoComplete="given-name"
                    placeholder="First name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white/90 placeholder:text-white/40 outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium tracking-wide text-white/70">Last name</label>
                  <input
                    value={signUpLastName}
                    onChange={(e) => setSignUpLastName(e.target.value)}
                    autoComplete="family-name"
                    placeholder="Last name"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white/90 placeholder:text-white/40 outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium tracking-wide text-white/70">Email / Phone</label>
                <input
                  value={signUpEmailOrPhone}
                  onChange={(e) => setSignUpEmailOrPhone(e.target.value)}
                  autoComplete="username"
                  inputMode="email"
                  placeholder="Email or 10-digit phone"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white/90 placeholder:text-white/40 outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium tracking-wide text-white/70">Password</label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white/90 placeholder:text-white/40 outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    required
                  />
                  <button
                    type="button"
                    className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 outline-none transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowSignUpPassword((v) => !v)}
                  >
                    <EyeIcon off={showSignUpPassword} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium tracking-wide text-white/70">Re-enter password</label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <input
                    type={showSignUpRePassword ? "text" : "password"}
                    value={signUpRePassword}
                    onChange={(e) => setSignUpRePassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white/90 placeholder:text-white/40 outline-none transition hover:border-white/20 focus-visible:border-orange-400/35 focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    required
                  />
                  <button
                    type="button"
                    className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.04] text-white/80 outline-none transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-orange-400/25"
                    aria-label={showSignUpRePassword ? "Hide password" : "Show password"}
                    onClick={() => setShowSignUpRePassword((v) => !v)}
                  >
                    <EyeIcon off={showSignUpRePassword} />
                  </button>
                </div>
              </div>

              {signUpError ? (
                <div className="rounded-xl border border-rose-400/25 bg-rose-500/10 p-3 text-sm text-rose-100" role="alert">
                  {signUpError}
                </div>
              ) : null}

              <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] font-semibold text-white/85 outline-none transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-400/20"
                  onClick={() => setShowSignUp(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 font-semibold text-[#14110b] shadow-[0_12px_28px_rgba(255,122,0,0.22)] outline-none transition hover:brightness-110 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-300/35"
                >
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
