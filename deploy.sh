#!/usr/bin/env bash
# Redeploy Zodiak to https://zodiak.staywill.com
#   ./deploy.sh            build + upload app and dashboard, migrate, refresh caches
# First-time server setup (database, .env, nginx, HTTPS) is already done on the server.
set -euo pipefail

SERVER="root@72.61.246.14"
REMOTE="/var/www/zodiak"
SSH="ssh -o BatchMode=yes -o ConnectTimeout=15"
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▸ Building seeker app"
(cd "$ROOT/zodiak-app" && npm run build)

echo "▸ Building Op-Center assets"
(cd "$ROOT/zodiak-dashboard" && npm run build)

echo "▸ Uploading dashboard"
rsync -az --delete -e "$SSH" \
  --exclude vendor/ --exclude node_modules/ --exclude .env --exclude .env.backup --exclude .claude/ --exclude .mcp.json \
  --exclude 'database/*.sqlite' --exclude 'storage/logs/*' --exclude 'storage/framework/cache/data/*' \
  --exclude 'storage/framework/sessions/*' --exclude 'storage/framework/views/*' --exclude 'storage/app/private/*' \
  --exclude 'storage/app/public/*' --exclude 'bootstrap/cache/*.php' --exclude public/hot \
  "$ROOT/zodiak-dashboard/" "$SERVER:$REMOTE/dashboard/"

echo "▸ Uploading app"
rsync -az --delete -e "$SSH" "$ROOT/zodiak-app/dist/" "$SERVER:$REMOTE/app/"

echo "▸ Installing, migrating, caching on server"
$SSH "$SERVER" "set -e
cd $REMOTE/dashboard
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction --quiet
php artisan migrate --force --no-interaction
php artisan config:cache --no-interaction >/dev/null
php artisan route:cache --no-interaction >/dev/null
php artisan view:cache --no-interaction >/dev/null
chown -R www-data:www-data storage bootstrap/cache
systemctl reload php8.4-fpm"

echo "✓ Live at https://zodiak.staywill.com  (Op-Center: /admin)"
