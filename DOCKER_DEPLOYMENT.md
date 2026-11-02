# Deployment

Production is one Docker container on a server shared with other services.
nginx proxies `convertvideosfree.com` and `cropvideosfree.com` to it on
`127.0.0.1:4444`, with Cloudflare in front.

```bash
./deploy.sh              # build, copy over SSH, smoke-test, swap
./deploy.sh --rollback   # return to the previous container
```

`deploy.sh` needs Docker running locally and SSH access to the server. The image
is copied directly, so nothing is pushed to a registry.

Do not run `docker system prune`, or stop all containers, on the server: other
sites run there. The `~/convert-videos-free` checkout on the server is not used
by deployments.

## Before deploying

```bash
npm run typecheck && npm run lint

# Against a production build, in real Chrome (needs ffmpeg):
docker compose up --build -d
./tests/generate-fixtures.sh
E2E_BASE_URL=http://127.0.0.1:4444 E2E_PROD=1 npx playwright test
```
