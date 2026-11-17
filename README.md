# Devfest Toulouse 2026 — Passkeys

Install dependencies with `bun install`. Docker must be running, and the local
domains (`gta-passkeys-city.demo`, `devfest-toulouse-2026.demo`) and mkcert certificates in `infra/certs` must be configured for Caddy.

## Running the presentation

In development mode (i.e. with Hot reload enabled):

```sh
bun run dev
```

In presentation mode (presentation is built, then served):

```sh
bun run preview
```

Open https://gta-passkeys-city.demo.

## Deployment on GitHub pages

For GitHub Pages, the workflow builds with `API_MODE=offline` and the appropriate
`BASE_PATH`. A local equivalent is:

```sh
API_MODE=offline BASE_PATH=/devfest-toulouse-2026 bun run build
```
