import React from "react";
import "./SplashScreen.css";

export default function SplashScreen({ isFading = false }) {
  return (
    <div className={isFading ? "app-splash is-fading" : "app-splash"} role="status" aria-live="polite">
      <div className="app-splash__inner">
        <div className="app-splash__mark" aria-hidden="true" />
        <div className="app-splash__title">Loading</div>
        <div className="app-splash__subtitle">Preparing your experience…</div>
      </div>
    </div>
  );
}
