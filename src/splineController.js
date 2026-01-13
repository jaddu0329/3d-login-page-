// Lightweight controller to interact with Spline scene
// Configure object names and event types via .env if desired
// Fallbacks will try common names used in cute-computer scenes

let app = null;
let faceObj = null;

const env = (key, fallback) => (import.meta?.env?.[key] ?? fallback);

const FACE_CANDIDATES = [
  env('VITE_SPLINE_FACE_NAME', null),
  'Face',
  'Computer',
  'Head',
  'Character',
];

export function attachSpline(splineApp) {
  app = splineApp;
  faceObj = null;
  for (const name of FACE_CANDIDATES) {
    if (!name) continue;
    const obj = app.findObjectByName(name);
    if (obj) { faceObj = obj; break; }
  }
}

function getFace() {
  return faceObj;
}

// You can tune these in your Spline scene's Events panel
const SMILE_EVENT = env('VITE_SPLINE_SMILE_EVENT', 'mouseHover');
const HAPPY_EVENT = env('VITE_SPLINE_HAPPY_EVENT', 'mouseDown');
const LOOK_EVENT = env('VITE_SPLINE_LOOK_EVENT', 'lookAt');
const FOLLOW_EVENT = env('VITE_SPLINE_FOLLOW_EVENT', 'follow');

export function triggerSmile() {
  const face = getFace();
  if (face?.emitEvent) face.emitEvent(SMILE_EVENT);
}

export function triggerHappy() {
  const face = getFace();
  if (face?.emitEvent) face.emitEvent(HAPPY_EVENT);
}

export function lookAway() {
  const face = getFace();
  // Try lookAt first; if not wired, fallback to a subtle hover state
  if (face?.emitEvent) {
    try { face.emitEvent(LOOK_EVENT); } catch {}
    try { face.emitEvent(SMILE_EVENT); } catch {}
  }
}

export function lookCenter() {
  const face = getFace();
  // Follow/hover typically centers gaze; otherwise no-op
  if (face?.emitEvent) {
    try { face.emitEvent(FOLLOW_EVENT); } catch {}
    try { face.emitEvent(SMILE_EVENT); } catch {}
  }
}
