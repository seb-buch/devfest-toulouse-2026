To install dependencies (from the repository root):

```sh
bun install
```

To run:

```sh
bun run dev
```

open https://gta-passkeys-city.demo/passkeys/ui/ (through Caddy, see the root README)

The same app is also served on https://devfest-toulouse-2026.demo/passkeys/ui/, a related origin
(Related Origin Requests): the RP ID stays `gta-passkeys-city.demo`, which lists this origin in
`/.well-known/webauthn`.

The API is served under `/api` (`/passkeys/api` behind Caddy). Recovery emails are caught by Mailpit:
https://gta-passkeys-city.demo/mail/

| Variable                 | Default                 | Purpose                                   |
| ------------------------ | ----------------------- | ----------------------------------------- |
| `RP_ID`                  | `localhost`             | WebAuthn relying party ID                 |
| `EXPECTED_ORIGIN`        | `http://localhost:3002` | Origin expected in WebAuthn responses     |
| `RELATED_ORIGINS`        | none                    | Other origins allowed (comma-separated)   |
| `SESSION_SECRET`         | dev value               | Session cookie signing key                |
| `FAKE_CREDENTIAL_SECRET` | dev value               | Fake credential IDs for unknown usernames |
| `RECOVERY_URL`           | `<origin>/passkeys/ui/` | Page opened by the recovery link          |
| `SMTP_HOST`, `SMTP_PORT` | `localhost`, `1025`     | SMTP server (Mailpit)                     |
