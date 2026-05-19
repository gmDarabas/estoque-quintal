#!/usr/bin/env bash
# Faz backup do Supabase para .pg_backups/
# Requer SUPABASE_DB_URL no .env
#
# Backup:  ./backup.sh
# Restore: docker compose up -d db
#          docker compose exec db sh -c "gunzip -c /backups/backup_YYYYMMDD_HHMMSS.sql.gz | psql -U postgres estoque_backup"

set -euo pipefail

docker compose --profile backup run --rm backup
