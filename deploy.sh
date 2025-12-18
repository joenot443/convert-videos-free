#!/bin/bash

# Deploy script for Convert Videos Free
# Server: root@165.227.44.1:~/convert-videos-free

set -e  # Exit on any error

# Configuration
SERVER="root@165.227.44.1"
REMOTE_DIR="~/convert-videos-free"
LOCAL_DIR="$(dirname "$0")"
CONTAINER_NAME="convert-videos-free"
IMAGE_NAME="convert-videos-free"

cd "$LOCAL_DIR"

echo "=========================================="
echo "  Deploying Convert Videos Free"
echo "=========================================="

# Step 1: Git add, commit, and push
echo ""
echo "[1/5] Committing and pushing changes..."
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    read -p "Enter commit message: " COMMIT_MSG
    git commit -m "$COMMIT_MSG"
    git push
    echo "Changes pushed to remote!"
else
    echo "No changes to commit."
fi

# Step 2: Pull latest code on server
echo ""
echo "[2/5] Pulling latest code on server..."
ssh "$SERVER" "cd $REMOTE_DIR && git pull"

# Step 3: Stop and remove current container
echo ""
echo "[3/5] Stopping current container..."
ssh "$SERVER" "docker rm -f $CONTAINER_NAME 2>/dev/null || true"

# Step 4: Rebuild Docker image
echo ""
echo "[4/5] Rebuilding Docker image..."
ssh "$SERVER" "cd $REMOTE_DIR && docker build --no-cache -t $IMAGE_NAME ."

# Step 5: Start new container
echo ""
echo "[5/5] Starting new container..."
ssh "$SERVER" "docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 4444:4444 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    $IMAGE_NAME"

# Verify deployment
echo ""
echo "Verifying deployment..."
sleep 3
ssh "$SERVER" "docker ps --filter name=$CONTAINER_NAME"

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo "  Site: https://convertvideosfree.com"
echo "=========================================="
