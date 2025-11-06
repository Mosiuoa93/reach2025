export function getApiBase() {
  const defaultApi = 'https://backend-old-smoke-6499.fly.dev';
  const envApi = process.env.REACT_APP_API_URL;
  try {
    if (!envApi) return defaultApi;
    const url = new URL(envApi);
    const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
    const isBrowser = typeof window !== 'undefined';
    const onProdHost = isBrowser && !['localhost', '127.0.0.1'].includes(window.location.hostname);

    // In production, never use a localhost API
    if (onProdHost && isLocal) return defaultApi;

    // Require http/https; otherwise, use default
    if (!/^https?:$/.test(url.protocol)) return defaultApi;

    return envApi;
  } catch {
    return defaultApi;
  }
}
