// Pages WebSocket entry for the existing Tokyo VPS.
// Node credentials stay at the VPS; this Worker does not generate subscriptions.
// sslip.io resolves this fixed hostname to the embedded VPS address.
// Workers fetch requires a hostname; the retired domain is not used.
const UPSTREAM_ORIGIN = 'http://152.32.147.128.sslip.io';
const WS_PATH_SHA256 = 'cbf7a27e2bfe7b8fe8f29f25ca81e1006bcdfb5fc7e54921aa30a1aaf4a27d8c';
const FORWARDED_HEADERS = [
  'Upgrade', 'Connection', 'Sec-WebSocket-Key', 'Sec-WebSocket-Version',
  'Sec-WebSocket-Protocol', 'Sec-WebSocket-Extensions', 'User-Agent',
];

function emptyResponse(status) {
  return new Response(null, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

async function sha256(text) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== 'GET' ||
        request.headers.get('Upgrade')?.toLowerCase() !== 'websocket' ||
        url.search || await sha256(url.pathname) !== WS_PATH_SHA256) {
      return emptyResponse(404);
    }

    const headers = new Headers();
    for (const name of FORWARDED_HEADERS) {
      const value = request.headers.get(name);
      if (value !== null) headers.set(name, value);
    }
    headers.set('Host', new URL(UPSTREAM_ORIGIN).hostname);
    headers.set('Upgrade', 'websocket');
    headers.set('Connection', 'Upgrade');

    try {
      const upstream = await fetch(new URL(url.pathname, UPSTREAM_ORIGIN), {
        method: 'GET', headers, redirect: 'manual',
      });
      // Return the original response to preserve the WebSocket connection.
      return upstream.status === 101 ? upstream : emptyResponse(502);
    } catch {
      return emptyResponse(502);
    }
  },
};
