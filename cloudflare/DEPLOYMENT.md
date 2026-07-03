# Deployment Guide — Inversiones Valencia Mundo Net

Esta guía describe cómo desplegar el portal en **Cloudflare Pages** usando **D1** y **R2**, y cómo subir el repositorio a **GitHub**.

## Prerrequisitos

1. Cuenta de Cloudflare (gratuita)
2. Cuenta de GitHub
3. Wrangler CLI instalado: `npm install -g wrangler`
4. Credenciales (mantener en secreto, no commitear):
   - GitHub Personal Access Token
   - Cloudflare API Token

## 1. Subir el repositorio a GitHub

```bash
# Inicializar git si no existe
git init
git add .
git commit -m "Initial commit: Inversiones Valencia Mundo Net portal"

# Crear repo en GitHub (requiere gh CLI o API)
gh repo create inversiones-valencia-mundo-net --public --source=. --remote=origin --push

# O manualmente con el token
git remote add origin https://<GITHUB_TOKEN>@github.com/<USER>/inversiones-valencia-mundo-net.git
git branch -M main
git push -u origin main
```

## 2. Configurar D1 (base de datos)

El D1 ya existe con ID `38dd85ba-03dc-4937-af19-4d1c41a18f27`.

```bash
# Autenticarse con Cloudflare
wrangler login

# Verificar que el D1 es accesible
wrangler d1 list

# Ejecutar el esquema (tablas prefijadas con ivmn_)
wrangler d1 execute inversiones-valencia-mundo-net \
  --remote \
  --file=cloudflare/schema-d1.sql

# Verificar tablas creadas
wrangler d1 execute inversiones-valencia-mundo-net \
  --remote \
  --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'ivmn_%';"
```

## 3. Crear bucket R2 para imágenes

```bash
# Crear bucket nuevo
wrangler r2 bucket create ivmn-products

# Verificar
wrangler r2 bucket list

# Crear carpeta para productos (subiendo un placeholder)
echo "Inversiones Valencia Mundo Net - Products bucket" > README.txt
wrangler r2 object put ivmn-products/inversiones-valencia/README.txt --file=README.txt
```

## 4. Conectar a Cloudflare Pages

### Opción A: Conectar vía GitHub (recomendado)

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
2. Selecciona el repositorio `inversiones-valencia-mundo-net`
3. Configura el build:
   - **Framework preset**: Next.js
   - **Build command**: `bun run build`
   - **Build output directory**: `.next`
   - **Node version**: 18+ (variable `NODE_VERSION=20`)
4. Variables de entorno (Settings → Environment variables):
   - `WHATSAPP_NUMBER` = `584169726126`
   - `WHATSAPP_DISPLAY` = `+58 416-9726126`
   - `SITE_NAME` = `Inversiones Valencia Mundo Net`
   - `NEXT_PUBLIC_SITE_URL` = `https://inversionesvalencia.pages.dev`
5. Bindings (Settings → Functions → Bindings):
   - **D1 database**: `DB` → `inversiones-valencia-mundo-net`
   - **R2 bucket**: `PRODUCTS_BUCKET` → `ivmn-products`

### Opción B: Deploy directo con Wrangler

```bash
# Instalar adapter para Cloudflare
bun add -D @cloudflare/next-on-pages

# Construir
bun run build

# Desplegar
wrangler pages deploy .next --project-name=inversiones-valencia-mundo-net
```

## 5. Configurar dominio personalizado (opcional)

1. Pages → Custom domains → Set up a domain
2. Agregar `inversionesvalencia.com.ve` (o el dominio que tengas)
3. Cloudflare configurará automáticamente los registros DNS

## 6. Verificación post-deployment

```bash
# Verificar que las tablas D1 existen
wrangler d1 execute inversiones-valencia-mundo-net \
  --remote \
  --command="SELECT COUNT(*) as total FROM ivmn_categories;"

# Verificar bucket R2
wrangler r2 object list ivmn-products --prefix=inversiones-valencia/

# Verificar deployment
curl -I https://inversionesvalencia.pages.dev
```

## Notas importantes

- **Prefijo de tablas**: Todas las tablas usan el prefijo `ivmn_` para no chocar con tablas ya existentes en el D1.
- **Carpeta R2**: Las imágenes se almacenan bajo `inversiones-valencia/products/` para no chocar con otros proyectos.
- **Variables públicas**: Las variables con prefijo `NEXT_PUBLIC_` se exponen al navegador. Solo pon allí datos no sensibles.
- **Secretos**: Tokens y contraseñas deben ir en Settings → Environment variables con tipo "Secret", no commiteados.
- **Backup**: Antes de ejecutar el esquema SQL, haz backup de las tablas existentes con `wrangler d1 export`.

## Comandos útiles

```bash
# Ver logs en vivo
wrangler pages deployment tail --project-name=inversiones-valencia-mundo-net

# Rollback a versión anterior
wrangler pages deployment rollback --project-name=inversiones-valencia-mundo-net

# Eliminar deployment
wrangler pages project delete inversiones-valencia-mundo-net
```

## Soporte

Para problemas con el deployment, contacta al desarrollador o consulta:
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 docs](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 docs](https://developers.cloudflare.com/r2/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
