#!/usr/bin/env bash
set -euo pipefail

TIMEOUT=60

# Start Docker Desktop if the daemon is not reachable
if ! docker info &>/dev/null; then
  echo "Docker daemon not running — launching Docker Desktop..."
  open -a Docker

  echo "Waiting for Docker daemon (up to ${TIMEOUT}s)..."
  elapsed=0
  until docker info &>/dev/null; do
    if [ "$elapsed" -ge "$TIMEOUT" ]; then
      echo "Error: Docker daemon did not start within ${TIMEOUT}s." >&2
      exit 1
    fi
    sleep 2
    elapsed=$((elapsed + 2))
  done
  echo "Docker daemon is ready."
fi

# Start (or recreate) the database container
echo "Starting database..."
docker compose up -d --wait

echo "Database is up and healthy."
