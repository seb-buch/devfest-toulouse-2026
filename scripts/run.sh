#!/bin/bash
set -e

cd "$(dirname "$0")/.."

case "${1:-}" in
  dev) command=dev ;;
  preview) command=start ;;
  *) echo "Usage: $0 <dev|preview>" >&2; exit 1 ;;
esac

export RP_ID=gta-passkeys-city.demo
export EXPECTED_ORIGIN=https://gta-passkeys-city.demo
export RELATED_ORIGINS=https://devfest-toulouse-2026.demo
# Recovery link: opens the presentation on the recovery demo slide (token in the fragment).
export RECOVERY_URL=https://gta-passkeys-city.demo/presentation/
export API_MODE=live
export BASE_PATH=

if [ "${command}" = start ]; then
  bun run build
fi

cleanup() {
  docker compose down proxy mailpit
}


trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

rm -f apps/auth-passkeys/data/*.sqlite{,-wal,-shm}
rm -f apps/auth-hybrid/data/*.sqlite{,-wal,-shm}
docker compose up -d --remove-orphans proxy mailpit
bun run --filter '*' "$command"
