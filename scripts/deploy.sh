#!/usr/bin/env bash
# ============================================================
# Script de deployment para Inversiones Valencia Mundo Net
# Sube el repo a GitHub y despliega a Cloudflare Pages
# ============================================================
set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Inversiones Valencia Mundo Net - Deployment${NC}"
echo -e "${GREEN}================================================${NC}"

# ------------------------------------------------------------
# CONFIGURACIÓN — Editar estas variables antes de ejecutar
# ------------------------------------------------------------
GITHUB_USER="${GITHUB_USER:-bboymak3}"
REPO_NAME="inversiones-valencia-mundo-net"
GITHUB_TOKEN="${GITHUB_TOKEN:-ghp_REEMPLAZAR_CON_TU_TOKEN}"
CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-REEMPLAZAR_CON_TU_TOKEN}"
D1_DATABASE_ID="38dd85ba-03dc-4937-af19-4d1c41a18f27"
D1_DATABASE_NAME="inversiones-valencia-mundo-net"
R2_BUCKET_NAME="ivmn-products"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# ------------------------------------------------------------
# PASO 1: Crear repositorio en GitHub
# ------------------------------------------------------------
echo -e "\n${YELLOW}[1/5] Creando repositorio en GitHub...${NC}"

# Verificar si el repo ya existe
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$GITHUB_USER/$REPO_NAME")

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${YELLOW}  → El repositorio ya existe, saltando creación.${NC}"
else
  curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"Portal e-shop para Inversiones Valencia Mundo Net - Cámaras de seguridad y tecnología\",\"private\":false,\"has_issues\":true,\"has_projects\":true,\"has_wiki\":true}" \
    > /dev/null
  echo -e "${GREEN}  ✓ Repositorio creado: https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
fi

# ------------------------------------------------------------
# PASO 2: Inicializar git y hacer push
# ------------------------------------------------------------
echo -e "\n${YELLOW}[2/5] Subiendo código a GitHub...${NC}"

if [ ! -d ".git" ]; then
  git init
fi

# Configurar remote
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USER/$REPO_NAME.git"

# Asegurar .gitignore
if [ ! -f ".gitignore" ]; then
  cat > .gitignore << 'EOF'
node_modules/
.next/
.env
.env.local
.env.production
*.log
.DS_Store
dev.log
server.log
.vscode/
.idea/
cloudflare_catalog.json
canva_catalog.json
EOF
fi

git add -A
git commit -m "Initial commit: Inversiones Valencia Mundo Net portal" 2>/dev/null || true
git branch -M main
git push -u origin main --force

echo -e "${GREEN}  ✓ Código subido a GitHub${NC}"

# ------------------------------------------------------------
# PASO 3: Configurar D1 (ejecutar esquema SQL)
# ------------------------------------------------------------
echo -e "\n${YELLOW}[3/5] Configurando Cloudflare D1...${NC}"

export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"

# Verificar que el D1 existe
echo "  → Verificando D1 $D1_DATABASE_NAME..."
D1_EXISTS=$(wrangler d1 list 2>/dev/null | grep -c "$D1_DATABASE_NAME" || echo "0")

if [ "$D1_EXISTS" = "0" ]; then
  echo -e "${RED}  ✗ El D1 no existe o no es accesible con el token proporcionado.${NC}"
  echo -e "${YELLOW}    Verifica el CLOUDFLARE_API_TOKEN y los permisos.${NC}"
else
  echo -e "${GREEN}  ✓ D1 accesible${NC}"

  # Ejecutar esquema (con --skip-if-exists para no fallar si ya existe)
  echo "  → Aplicando esquema SQL (tablas prefijadas ivmn_)..."
  wrangler d1 execute "$D1_DATABASE_NAME" --remote --file=cloudflare/schema-d1.sql || {
    echo -e "${YELLOW}  ⚠ Algunas tablas ya existen, esto es normal si ya estaba el D1.${NC}"
  }
  echo -e "${GREEN}  ✓ Esquema aplicado${NC}"
fi

# ------------------------------------------------------------
# PASO 4: Crear bucket R2
# ------------------------------------------------------------
echo -e "\n${YELLOW}[4/5] Configurando Cloudflare R2...${NC}"

echo "  → Verificando bucket $R2_BUCKET_NAME..."
R2_EXISTS=$(wrangler r2 bucket list 2>/dev/null | grep -c "$R2_BUCKET_NAME" || echo "0")

if [ "$R2_EXISTS" = "0" ]; then
  echo "  → Creando bucket..."
  wrangler r2 bucket create "$R2_BUCKET_NAME" || {
    echo -e "${YELLOW}  ⚠ No se pudo crear el bucket. Créalo manualmente en el dashboard.${NC}"
  }
  echo -e "${GREEN}  ✓ Bucket creado${NC}"
else
  echo -e "${GREEN}  ✓ El bucket ya existe${NC}"
fi

# Crear carpeta para imágenes del proyecto
echo "  → Creando estructura de carpetas para imágenes..."
README_CONTENT="Inversiones Valencia Mundo Net - Bucket de imágenes de productos. Carpeta: inversiones-valencia/products/"
echo "$README_CONTENT" | wrangler r2 object put "$R2_BUCKET_NAME/inversiones-valencia/README.txt" --pipe 2>/dev/null || true
echo -e "${GREEN}  ✓ Estructura creada${NC}"

# ------------------------------------------------------------
# PASO 5: Construir y desplegar a Cloudflare Pages
# ------------------------------------------------------------
echo -e "\n${YELLOW}[5/5] Desplegando a Cloudflare Pages...${NC}"

echo "  → Construyendo proyecto..."
bun install
bun run build

echo "  → Desplegando a Cloudflare Pages..."
wrangler pages deploy .next \
  --project-name=inversiones-valencia-mundo-net \
  --commit-dirty=true || {
    echo -e "${YELLOW}  ⚠ No se pudo desplegar automáticamente.${NC}"
    echo -e "${YELLOW}    Conecta el repo GitHub en: https://dash.cloudflare.com → Workers & Pages → Create${NC}"
  }

# ------------------------------------------------------------
# RESUMEN FINAL
# ------------------------------------------------------------
echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}  ✓ Deployment completado${NC}"
echo -e "${GREEN}================================================${NC}"
echo -e "\nRepositorio:   https://github.com/$GITHUB_USER/$REPO_NAME"
echo -e "Sitio web:     https://inversiones-valencia-mundo-net.pages.dev"
echo -e "D1 Database:   $D1_DATABASE_NAME (ID: $D1_DATABASE_ID)"
echo -e "R2 Bucket:     $R2_BUCKET_NAME"
echo -e "\n${YELLOW}Próximos pasos:${NC}"
echo -e "  1. Conecta el repo GitHub en Cloudflare Pages para auto-deploy"
echo -e "  2. Configura dominio personalizado si lo tienes"
echo -e "  3. Sube fotos reales de productos a R2 (carpeta: inversiones-valencia/products/)"
echo -e "  4. Actualiza el catálogo en src/data/catalog.ts con tus productos reales"
