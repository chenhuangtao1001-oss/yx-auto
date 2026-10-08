# Tokyo VPS WebSocket entry

The Pages project `yx-auto-chenhuangtao1001.pages.dev` now serves a WebSocket entry for the existing Tokyo VPS. The previous IP-selection interface and subscription generator have been removed. A normal request to `/` returns an empty HTTP 404; this is expected.

Traffic flows from the client's TLS WebSocket connection to Pages, then to the VPS WebSocket listener on port 80. The existing VPS authenticates Trojan connections. The Worker accepts only the existing WS path, stored as a SHA-256 digest, and does not store node passwords.

The fixed origin hostname is `152.32.147.128.sslip.io`. This public DNS service resolves the embedded IP to the VPS address. Workers' `fetch()` requires a hostname rather than a literal IP address. Origin traffic uses the existing HTTP/WS listener. The retired custom domain is not part of this route. Origin resolution depends on sslip.io availability.

## Client settings

- Protocol: Trojan; transport: WebSocket; port: 443.
- SNI and WS Host: `yx-auto-chenhuangtao1001.pages.dev`.
- Server: a tested Cloudflare IPv4 entry, or the Pages hostname.
- Password and WS path: use the private node configuration provided separately.
- Keep certificate verification enabled.

Never publish passwords, raw WS paths, subscription tokens, or private configuration files in this repository.

## Deployment

The connected Cloudflare Pages project automatically deploys changes from `main`. `_worker.js` runs in Pages advanced mode, with the repository root as its output directory. No extra dependencies or build step are required. Git history retains the former application for rollback.

After deployment, verify an actual Trojan/WS connection, a complete webpage response, and a completed download. A successful TCP connection to a Cloudflare IP alone does not demonstrate proxy availability or speed.

References: [Pages advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/), [Workers WebSockets](https://developers.cloudflare.com/workers/runtime-apis/websockets/), [Workers known issues](https://developers.cloudflare.com/workers/platform/known-issues/), [sslip.io](https://sslip.io/).
