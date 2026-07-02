#!/usr/bin/env bash
# Sube todas las imágenes mapeadas a R2 usando la API REST de Cloudflare
# con paralelismo real usando xargs

set -e

ACCOUNT_ID="6fc12c9a89723c0039cf189380c0b02f"
TOKEN="${CLOUDFLARE_API_TOKEN:-cfat_naWITBGqOglu5muByQko68PgtpaQhn7qRcxlVEWn9d4e233c}"
BUCKET="ivmn-products"
MAPPED_DIR="/home/z/my-project/images/mapped"
LOG_FILE="/home/z/my-project/images/_upload_fast.log"

if [ ! -d "$MAPPED_DIR" ]; then
  echo "ERROR: No existe $MAPPED_DIR"
  exit 1
fi

TOTAL=$(ls "$MAPPED_DIR"/*.png 2>/dev/null | wc -l)
echo "=== Subiendo $TOTAL imágenes a R2 (API REST + xargs paralelo) ==="
echo "Inicio: $(date)"
> "$LOG_FILE"

# Función para subir una imagen (será llamada por xargs)
upload_one() {
  local file="$1"
  local sku=$(basename "$file" .png)
  local key="inversiones-valencia/products/${sku}.jpg"

  local http_code=$(curl -s -o /dev/null -X PUT \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: image/jpeg" \
    --data-binary @"$file" \
    -w "%{http_code}" \
    "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/r2/buckets/$BUCKET/objects/$key")

  if [ "$http_code" = "200" ]; then
    echo "ok $sku" >> "$LOG_FILE"
  else
    echo "fail $sku $http_code" >> "$LOG_FILE"
  fi
}
export -f upload_one
export ACCOUNT_ID TOKEN BUCKET LOG_FILE

# Subir en paralelo con xargs (10 concurrentes)
ls "$MAPPED_DIR"/*.png | xargs -P 10 -I {} bash -c 'upload_one "$@"' _ {} 

echo ""
echo "Fin: $(date)"
echo ""
echo "=== RESUMEN ==="
OK=$(grep -c "^ok " "$LOG_FILE" 2>/dev/null || echo 0)
FAIL=$(grep -c "^fail " "$LOG_FILE" 2>/dev/null || echo 0)
echo "  ✓ Subidas: $OK"
echo "  ✗ Fallidas: $FAIL"
echo "  Total procesadas: $((OK + FAIL)) de $TOTAL"
echo ""
echo "Log completo: $LOG_FILE"
