#!/bin/bash
# Builds the image here, copies it to the server over SSH, smoke-tests it on a
# spare port, then swaps it in. If the swap fails, the old container comes back.
#
#   ./deploy.sh              deploy the working tree
#   ./deploy.sh --rollback   go back to the previous container
#
# The server is shared with other services. Only touch containers named below,
# and never run `docker system prune` or stop every container there.
set -euo pipefail

SERVER="root@165.227.44.1"
NAME="convert-videos-free"

cd "$(dirname "$0")"

if [ "${1:-}" = "--rollback" ]; then
  ssh "$SERVER" "docker inspect $NAME-previous >/dev/null \
    && docker rm -f $NAME \
    && docker rename $NAME-previous $NAME \
    && docker start $NAME"
  echo "Rolled back."
  exit 0
fi

TAG="$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
IMAGE="$NAME:$TAG"

echo "Building $IMAGE..."
docker build --platform linux/amd64 -t "$IMAGE" .

echo "Copying image to the server..."
docker save --platform linux/amd64 "$IMAGE" | gzip | ssh "$SERVER" "gunzip | docker load"

echo "Deploying..."
ssh "$SERVER" "bash -s" -- "$NAME" "$IMAGE" <<'REMOTE'
set -euo pipefail
NAME="$1"; IMAGE="$2"

run_on() { # port, container name
  docker run -d --name "$2" --restart unless-stopped -p "127.0.0.1:$1:4444" \
    -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 "$IMAGE" >/dev/null
}

healthy() { # port
  for _ in $(seq 1 30); do
    if curl -fsS -m 3 -o /dev/null "http://127.0.0.1:$1/" \
      && curl -fsS -m 3 -o /dev/null "http://127.0.0.1:$1/about" \
      && curl -fsS -m 3 -o /dev/null "http://127.0.0.1:$1/workers/conversion.worker.js"; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# Smoke test while the live container keeps serving.
docker rm -f "$NAME-candidate" >/dev/null 2>&1 || true
run_on 4445 "$NAME-candidate"
if ! healthy 4445; then
  echo "New image failed its smoke test. Live site untouched." >&2
  docker logs --tail 30 "$NAME-candidate" >&2
  docker rm -f "$NAME-candidate" >/dev/null
  exit 1
fi
docker rm -f "$NAME-candidate" >/dev/null

# Swap, keeping the old container for rollback.
docker rm -f "$NAME-previous" >/dev/null 2>&1 || true
docker stop "$NAME" >/dev/null
docker rename "$NAME" "$NAME-previous"
run_on 4444 "$NAME"

if ! healthy 4444; then
  echo "New container is unhealthy. Restoring the previous one." >&2
  docker logs --tail 30 "$NAME" >&2
  docker rm -f "$NAME" >/dev/null
  docker rename "$NAME-previous" "$NAME"
  docker start "$NAME" >/dev/null
  exit 1
fi
docker ps --filter "name=^/$NAME$" --format '{{.Names}}  {{.Image}}  {{.Status}}'
REMOTE

echo "Deployed $IMAGE"
echo "  Convert: https://convertvideosfree.com"
echo "  Crop:    https://cropvideosfree.com"
