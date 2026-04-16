#!/usr/bin/env bash
set -euo pipefail

umask 077

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups/postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[backup-db] Error: no se encontro el archivo de entorno: $ENV_FILE" >&2
  exit 1
fi

# Exporta variables de .env al entorno del script.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "[backup-db] Error: DATABASE_URL no esta definida en $ENV_FILE" >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "[backup-db] Error: pg_dump no esta instalado o no esta en PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

timestamp="$(date +%Y%m%d_%H%M%S)"
backup_file="$BACKUP_DIR/kodaore_${timestamp}.sql.gz"
tmp_file="$backup_file.tmp"

echo "[backup-db] Iniciando backup en $backup_file"
pg_dump --dbname="$DATABASE_URL" --no-owner --no-privileges | gzip -9 > "$tmp_file"
mv "$tmp_file" "$backup_file"

echo "[backup-db] Aplicando rotacion de ${RETENTION_DAYS} dias en $BACKUP_DIR"
find "$BACKUP_DIR" -type f -name "kodaore_*.sql.gz" -mtime "+$RETENTION_DAYS" -delete

echo "[backup-db] Backup completado"
