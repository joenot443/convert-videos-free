#!/bin/bash

# Deploy script for Convert Videos Free
# Server: root@165.227.44.1:~/convert-videos-free

set -e  # Exit on any error

# Configuration
SERVER="root@165.227.44.1"
REMOTE_DIR="~/convert-videos-free"
LOCAL_DIR="$(dirname "$0")"

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

# Step 3: Stop current container
echo ""
echo "[3/5] Stopping current container..."
ssh "$SERVER" "cd $REMOTE_DIR && docker-compose down || true"

# Step 4: Rebuild Docker image
echo ""
echo "[4/5] Rebuilding Docker image..."
ssh "$SERVER" "cd $REMOTE_DIR && docker-compose build --no-cache"

# Step 5: Start new container
echo ""
echo "[5/5] Starting new container..."
ssh "$SERVER" "cd $REMOTE_DIR && docker-compose up -d"

# Verify deployment
echo ""
echo "Verifying deployment..."
sleep 3
ssh "$SERVER" "cd $REMOTE_DIR && docker-compose ps"

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo "  Site: https://convertvideosfree.com"
echo "=========================================="
