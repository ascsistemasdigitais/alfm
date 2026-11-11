#!/usr/bin/env bash
# Deploy do site estatico para AWS (S3 + CloudFront)
#
# Uso:
#   1. Edite as 3 variaveis abaixo (BUCKET, DISTRIBUTION_ID, SITE_DIR)
#   2. chmod +x deploy.sh
#   3. ./deploy.sh
#
# Requisitos: AWS CLI instalada e configurada (aws configure)

set -euo pipefail

# ====== CONFIGURE AQUI ======
BUCKET="NOME-DO-SEU-BUCKET"            # ex.: easyvoting-site
DISTRIBUTION_ID="SEU_ID_CLOUDFRONT"    # ex.: E1ABCDEF234567
SITE_DIR="./site"                      # pasta com index.html, logo.png etc.
# ============================

if [[ "$BUCKET" == "NOME-DO-SEU-BUCKET" || "$DISTRIBUTION_ID" == "SEU_ID_CLOUDFRONT" ]]; then
  echo "ERRO: edite BUCKET e DISTRIBUTION_ID no inicio do script." >&2
  exit 1
fi

if [[ ! -f "$SITE_DIR/index.html" ]]; then
  echo "ERRO: $SITE_DIR/index.html nao encontrado." >&2
  exit 1
fi

echo "==> Enviando arquivos para s3://$BUCKET ..."

# 1) Imagens e fontes (raramente mudam): cache longo
aws s3 sync "$SITE_DIR" "s3://$BUCKET" \
  --delete \
  --exclude "*.html" --exclude "*.css" --exclude "*.js" \
  --exclude "sitemap.xml" --exclude "robots.txt" \
  --cache-control "public, max-age=31536000"

# 2) HTML, CSS, JS, sitemap e robots: cache curto, para atualizar rapido
aws s3 sync "$SITE_DIR" "s3://$BUCKET" \
  --exclude "*" \
  --include "*.html" --include "*.css" --include "*.js" \
  --include "sitemap.xml" --include "robots.txt" \
  --cache-control "public, max-age=300"

echo "==> Invalidando cache do CloudFront ..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query "Invalidation.Id" --output text

echo "==> Deploy concluido."
