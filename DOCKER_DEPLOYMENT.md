# Docker Deployment Guide

## Why Docker?

Docker allows you to run this application on **any server**, regardless of the host's Node.js version. The container includes Node 20, so your server's Node version (even v16 or older) doesn't matter.

## Prerequisites

**On your server, you only need:**
- Docker installed
- Docker Compose (optional, but recommended)

**You do NOT need:**
- Node.js installed on the host
- npm installed on the host
- Any specific Ubuntu version

## Building on the Server

Since your server has Docker, you can build directly on the server:

```bash
# 1. Copy your project files to the server (via git, scp, rsync, etc.)
# 2. Navigate to the project directory
cd ~/convert-videos-free

# 3. Build the Docker image (this uses Node 20 INSIDE the container)
docker build -t media-converter .

# 4. Run the container
docker run -d -p 4444:4444 --name media-converter --restart unless-stopped media-converter
```

## Using Docker Compose (Recommended)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

## Building Locally and Transferring

If you prefer to build on your local machine and transfer the image:

### Option 1: Save/Load Image
```bash
# On your local machine (with Node 18+)
docker build -t media-converter .
docker save media-converter > media-converter.tar

# Transfer the tar file to your server, then:
docker load < media-converter.tar
docker run -d -p 4444:4444 --name media-converter --restart unless-stopped media-converter
```

### Option 2: Use Docker Registry
```bash
# On your local machine
docker build -t your-registry/media-converter:latest .
docker push your-registry/media-converter:latest

# On your server
docker pull your-registry/media-converter:latest
docker run -d -p 4444:4444 --name media-converter --restart unless-stopped your-registry/media-converter:latest
```

## Verifying It Works

```bash
# Check if container is running
docker ps

# Check logs
docker logs media-converter

# Test the application
curl http://localhost:4444
```

## Troubleshooting

### Build fails with "npm ci" errors
The Dockerfile uses `npm install` which handles out-of-sync lock files. If you still have issues, you can regenerate the lock file locally and commit it.

### Port already in use
Change the port mapping: `-p 8080:4444` (maps host port 8080 to container port 4444)

### Container exits immediately
Check logs: `docker logs media-converter`

## Key Point

**The server's Node.js version doesn't matter!** Docker builds everything inside a container with Node 20, completely isolated from your host system.
