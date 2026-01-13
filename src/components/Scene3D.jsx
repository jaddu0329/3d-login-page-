import React, { useEffect, useMemo, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import "./Scene3D.css";
import {
  SPLINE_IFRAME_URL,
  SPLINE_MAIN_EVENT,
  SPLINE_MAIN_EVENT_TARGET,
  SPLINE_SCENE_URL,
  SPLINE_SPLASH_TO_MAIN_MS,
} from "../splineSceneUrl";

function pickExistingTarget(app, preferredName) {
  if (!app) return null;

  const candidates = [
    preferredName,
    "Scene",
    "Computer",
    "Root",
    "Camera",
    "Cube",
    "Sphere",
  ].filter(Boolean);

  for (const name of candidates) {
    try {
      const obj = app.findObjectByName?.(name);
      if (obj?.name) return obj.name;
    } catch {}
  }

  try {
    const all = app.getAllObjects?.() ?? [];
    return all[0]?.name ?? null;
  } catch {
    return null;
  }
}

class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function Scene3D({ enableInteractions = false, onMainReady }) {
  const appRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const sceneUrl = SPLINE_SCENE_URL;
  const isSplineCode = /\.splinecode(\?|$)/i.test(sceneUrl);

  const mainTargetName = useMemo(() => {
    const app = appRef.current;
    if (!app) return SPLINE_MAIN_EVENT_TARGET;
    return pickExistingTarget(app, SPLINE_MAIN_EVENT_TARGET) ?? SPLINE_MAIN_EVENT_TARGET;
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    // Give the scene time to play its internal Splash animation, then trigger transition.
    const t = window.setTimeout(() => {
      if (isSplineCode) {
        const app = appRef.current;
        if (app) {
          const target = pickExistingTarget(app, SPLINE_MAIN_EVENT_TARGET);
          try {
            // Emit an event wired in Spline to transition from Splash -> Main/Base.
            // Note: emitEvent requires an event name and a target object name/uuid.
            if (typeof app.emitEvent === "function" && target) {
              app.emitEvent(SPLINE_MAIN_EVENT, target);
            }
          } catch {}
        }
      }

      // Enable interactions after the splash period in both modes.
      onMainReady?.();
    }, Number.isFinite(SPLINE_SPLASH_TO_MAIN_MS) ? SPLINE_SPLASH_TO_MAIN_MS : 1200);

    return () => window.clearTimeout(t);
  }, [loaded, onMainReady, isSplineCode]);

  const handleLoad = (splineApp) => {
    appRef.current = splineApp;
    setLoaded(true);
    setError(null);
  };

  const handleIframeLoad = () => {
    setLoaded(true);
    setError(null);
  };

  const showIframeFallback = !isSplineCode;
  const iframeFallback = (
    <iframe
      src={SPLINE_IFRAME_URL}
      title="Spline 3D"
      loading="eager"
      allow="fullscreen"
      onLoad={handleIframeLoad}
    />
  );

  return (
    <div
      className={
        "spline-stage" +
        (loaded ? " is-loaded" : "") +
        (enableInteractions ? " is-interactive" : "")
      }
      aria-hidden="true"
    >
      {!loaded && (
        <div className="spline-loading" aria-hidden="true">
          <div className="loading-spinner" />
          <p>Loading 3D scene…</p>
        </div>
      )}

      {error ? (
        <div className="spline-error" role="status" aria-live="polite">
          <p>{error}</p>
        </div>
      ) : showIframeFallback ? (
        iframeFallback
      ) : (
        <SplineErrorBoundary fallback={iframeFallback}>
          <Spline scene={sceneUrl} onLoad={handleLoad} style={{ width: "100%", height: "100%" }}>
            {/* lightweight placeholder while Spline loads */}
          </Spline>
        </SplineErrorBoundary>
      )}
    </div>
  );
}