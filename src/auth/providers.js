// Lightweight OAuth redirect helpers for Google, GitHub, and Apple
// NOTE: These are frontend redirects and require proper OAuth app configuration.
// Add client IDs and a redirect URI in your .env (see .env.example).

function getEnv(name) {
  return import.meta.env[name] || process.env[name];
}

function randomString(len = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function getRedirectUri() {
  return (
    getEnv('VITE_OAUTH_REDIRECT_URI') || `${window.location.origin}/auth/callback`
  );
}

function ensureConfigured(provider) {
  const idMap = {
    google: 'VITE_GOOGLE_CLIENT_ID',
    github: 'VITE_GITHUB_CLIENT_ID',
    apple: 'VITE_APPLE_CLIENT_ID', // Apple Service ID
  };
  const key = idMap[provider];
  const clientId = getEnv(key);
  if (!clientId) {
    alert(`${provider} sign-in is not configured. Set ${key} and VITE_OAUTH_REDIRECT_URI in .env`);
    return null;
  }
  return clientId;
}

export function signInWithGoogle() {
  const clientId = ensureConfigured('google');
  if (!clientId) return;
  const redirectUri = getRedirectUri();
  const state = randomString(24);
  sessionStorage.setItem('oauth_state', state);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    include_granted_scopes: 'true',
    prompt: 'select_account',
    state,
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  window.location.href = url;
}

export function signInWithGithub() {
  const clientId = ensureConfigured('github');
  if (!clientId) return;
  const redirectUri = getRedirectUri();
  const state = randomString(24);
  sessionStorage.setItem('oauth_state', state);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state,
    allow_signup: 'true',
  });
  const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
  window.location.href = url;
}

export function signInWithApple() {
  const clientId = ensureConfigured('apple');
  if (!clientId) return;
  const redirectUri = getRedirectUri();
  const state = randomString(24);
  sessionStorage.setItem('oauth_state', state);
  const params = new URLSearchParams({
    client_id: clientId, // Apple Service ID
    redirect_uri: redirectUri,
    response_type: 'code',
    response_mode: 'query',
    scope: 'name email',
    state,
  });
  const url = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
  window.location.href = url;
}
