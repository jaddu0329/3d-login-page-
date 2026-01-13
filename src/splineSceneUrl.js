// Centralized Spline scene URL (iframe embed)
// Optionally override via Vite env: VITE_SPLINE_IFRAME_URL

// For @splinetool/react-spline, use the Spline Export → Code → React URL (usually ends with .splinecode)
// Optionally override via Vite env: VITE_SPLINE_SCENE_URL
// Example: https://prod.spline.design/.../scene.splinecode

const env = (key, fallback) => (import.meta.env[key] ?? fallback);

export const SPLINE_IFRAME_URL =
  env("VITE_SPLINE_IFRAME_URL", null) ??
  "https://my.spline.design/cutecomputerfollowcursor-Dhn9L5ECKgzqzhILzhWP29px/";

export const SPLINE_SCENE_URL =
  env("VITE_SPLINE_SCENE_URL", null) ??
  // Fallback to the iframe URL (may not work with react-spline unless it's a .splinecode URL)
  SPLINE_IFRAME_URL;

// How long the Spline internal Splash animation lasts before transitioning to Base/Main.
// Optionally override via Vite env: VITE_SPLINE_SPLASH_TO_MAIN_MS
export const SPLINE_SPLASH_TO_MAIN_MS = Number(env("VITE_SPLINE_SPLASH_TO_MAIN_MS", 1200));

// Which event and object to emit to move from Splash -> Main/Base.
// Wire this in Spline's Events panel on the chosen object.
export const SPLINE_MAIN_EVENT = env("VITE_SPLINE_MAIN_EVENT", "start");
export const SPLINE_MAIN_EVENT_TARGET = env("VITE_SPLINE_MAIN_EVENT_TARGET", "Scene");
