# Development Guide

## Local Development (Your Dev Machine)

**Prerequisites:**
- Node.js 18+ installed
- npm installed

**Run locally:**
```bash
# Install dependencies
npm install

# Start development server (runs on port 4444)
npm run dev

# Open http://localhost:4444 in your browser
```

**Other commands:**
```bash
# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Docker Development

**Build and run with Docker:**
```bash
# Build the image
docker build -t media-converter .

# Run the container
docker run -d -p 4444:4444 --name media-converter media-converter

# Or use docker-compose
docker-compose up -d
```

## Important Notes

### The `output: 'standalone'` Setting

The `next.config.js` file has `output: 'standalone'` which is needed for Docker. **This does NOT affect local development:**

- ✅ **Local dev (`npm run dev`)**: Works normally, ignores this setting
- ✅ **Local production (`npm run build && npm start`)**: Works normally, creates standalone output
- ✅ **Docker**: Uses the standalone output for optimized container builds

### Port Configuration

Both local and Docker use port **4444**:
- Local: `npm run dev` → http://localhost:4444
- Docker: Container exposes port 4444 → http://localhost:4444

### Switching Between Modes

You can freely switch between:
1. Local development: `npm run dev`
2. Docker: `docker-compose up`
3. Local production: `npm run build && npm start`

All use the same port (4444) and configuration.
