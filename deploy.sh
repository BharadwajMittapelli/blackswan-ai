#!/usr/bin/env bash
# deploy.sh — Deploy BlackSwan API to Google Cloud Run
# Usage: ./deploy.sh
set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration — edit these before first deploy
# ---------------------------------------------------------------------------
PROJECT_ID="${GCP_PROJECT_ID:?Set GCP_PROJECT_ID env var}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="blackswan-api"

# ---------------------------------------------------------------------------
# Deploy to Cloud Run from source (uses Cloud Build under the hood)
# ---------------------------------------------------------------------------
gcloud run deploy "${SERVICE_NAME}" \
    --source . \
    --project "${PROJECT_ID}" \
    --region "${REGION}" \
    --platform managed \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 1 \
    --concurrency 80 \
    --timeout 300 \
    --min-instances 0 \
    --max-instances 5 \
    --port 8080 \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=${PROJECT_ID}" \
    --set-env-vars "GOOGLE_API_KEY=${GOOGLE_API_KEY:-PLACEHOLDER_REPLACE_ME}" \
    --set-env-vars "COINGECKO_API_KEY=${COINGECKO_API_KEY:-}" \
    --set-env-vars "DEXSCREENER_API_KEY=${DEXSCREENER_API_KEY:-}"

echo ""
echo "✅ Deployment complete. Service URL:"
gcloud run services describe "${SERVICE_NAME}" \
    --project "${PROJECT_ID}" \
    --region "${REGION}" \
    --format "value(status.url)"
