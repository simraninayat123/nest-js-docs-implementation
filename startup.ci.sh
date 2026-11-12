#!/bin/sh
set -e

npm run lint
npm run format:check
npm run migration:run
npm run migration:check
npm run seed:run

node ./dist/main.js > prod.log 2>&1 &
APP_PID=$!

for i in $(seq 1 30); do
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo "Smoke test failed: app exited before listening on port 3000"
    cat prod.log
    exit 1
  fi
  if node -e "require('net').connect(3000, '127.0.0.1').on('connect', () => process.exit(0)).on('error', () => process.exit(1))"; then
    echo "Smoke test passed: app is listening on port 3000"
    kill "$APP_PID"
    exit 0
  fi
  sleep 1
done

echo "Smoke test failed: app did not listen on port 3000 within 30 seconds"
cat prod.log
exit 1
