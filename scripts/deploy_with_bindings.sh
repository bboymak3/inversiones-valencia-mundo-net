#!/usr/bin/env bash
# Deploy a Cloudflare Pages + aplicar bindings D1/R2 después
set -e

ACCOUNT_ID="6fc12c9a89723c0039cf189380c0b02f"
TOKEN="${CLOUDFLARE_API_TOKEN:-cfat_naWITBGqOglu5muByQko68PgtpaQhn7qRcxlVEWn9d4e233c}"
PROJECT="inversiones-valencia-mundo-net"

echo "=== 1. Build ==="
cd /home/z/my-project
bun run build:pages

echo ""
echo "=== 2. Deploy a Cloudflare Pages ==="
./node_modules/.bin/wrangler pages deploy .vercel/output/static \
  --project-name=$PROJECT \
  --branch=main \
  --commit-dirty=true

echo ""
echo "=== 3. Aplicar bindings D1 + R2 vía API ==="
# NOTA: Los bindings se aplican al PROJECT (no al deployment)
# y se usan en el SIGUIENTE deploy
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT" \
  -d '{
    "deployment_configs": {
      "production": {
        "compatibility_flags": ["nodejs_compat"],
        "compatibility_date": "2025-07-01",
        "bindings": [
          {"type": "d1", "name": "DB", "database_name": "generico_db", "database_id": "38dd85ba-03dc-4937-af19-4d1c41a18f27"},
          {"type": "r2_bucket", "name": "PRODUCTS_BUCKET", "bucket_name": "ivmn-products"}
        ]
      },
      "preview": {
        "compatibility_flags": ["nodejs_compat"],
        "compatibility_date": "2025-07-01",
        "bindings": [
          {"type": "d1", "name": "DB", "database_name": "generico_db", "database_id": "38dd85ba-03dc-4937-af19-4d1c41a18f27"},
          {"type": "r2_bucket", "name": "PRODUCTS_BUCKET", "bucket_name": "ivmn-products"}
        ]
      }
    }
  }' | python3 -c "
import json,sys
d = json.load(sys.stdin)
print('Bindings aplicados:', d.get('success'))
"

echo ""
echo "=== 4. Redeploy para que tome los bindings ==="
./node_modules/.bin/wrangler pages deploy .vercel/output/static \
  --project-name=$PROJECT \
  --branch=main \
  --commit-dirty=true

echo ""
echo "=== 5. Verificación ==="
sleep 30
echo "Endpoint /api/img/IVMN-REDE-0001:"
curl -s -o /dev/null -w "  HTTP %{http_code} | %{content_type} | %{size_download}b\n" "https://$PROJECT.pages.dev/api/img/IVMN-REDE-0001"

echo ""
echo "=== DONE ==="
echo "URL: https://$PROJECT.pages.dev"
echo "Admin: https://$PROJECT.pages.dev/admin"
