#!/bin/bash
# Run script for Convert Videos Free (execute on server)
set -e

CONTAINER_NAME="convert-videos-free"
IMAGE_NAME="convert-videos-free"

echo "Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true

echo "Cleaning up Docker..."
docker system prune -af

echo "Building Docker image..."
docker build --no-cache -t $IMAGE_NAME .

echo "Starting container..."
docker run -d --name $CONTAINER_NAME --restart unless-stopped -p 4444:4444 -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 $IMAGE_NAME

echo "Done! Container is running on port 4444"
