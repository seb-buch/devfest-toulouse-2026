To install dependencies (from the repository root):

```sh
bun install
```

To run:

```sh
bun run dev
```

open https://gta-passkeys-city.demo/hybrid/ui/ (through Caddy, see the root README)

The API is served under `/api` (`/hybrid/api` behind Caddy).

| Variable          | Default                 | Purpose                               |
| ----------------- | ----------------------- | ------------------------------------- |
| `RP_ID`           | `localhost`             | WebAuthn relying party ID             |
| `EXPECTED_ORIGIN` | `http://localhost:3001` | Origin expected in WebAuthn responses |
