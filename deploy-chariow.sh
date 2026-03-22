#!/bin/bash

# ============================================================================
# Quick Deploy Script for Chariow Edge Functions
# Usage: ./deploy-chariow.sh
# ============================================================================

set -e

echo "🚀 EduPlan - Chariow Edge Functions Deployment"
echo "============================================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo "   Install it: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Get project ID from current Supabase config or user input
if [ -f "supabase/.branches/main/config.toml" ]; then
    PROJECT_ID=$(grep -A2 "^\[_meta\]" supabase/.branches/main/config.toml | grep "name" | cut -d'"' -f2 || echo "")
fi

if [ -z "$PROJECT_ID" ]; then
    read -p "Enter your Supabase Project ID: " PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ No Project ID provided"
    exit 1
fi

echo "📍 Project ID: $PROJECT_ID"
echo ""

# Check .env file
echo "🔍 Checking .env configuration..."
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Copy .env.example to .env and fill in your values."
    exit 1
fi

# Verify Chariow configuration
if ! grep -q "CHARIOW_SECRET_KEY" .env; then
    echo "❌ CHARIOW_SECRET_KEY not found in .env"
    exit 1
fi

if ! grep -q "VITE_CHARIOW_PRODUCT_ID_PRO" .env; then
    echo "❌ VITE_CHARIOW_PRODUCT_ID_PRO not found in .env"
    exit 1
fi

echo "✅ .env configuration looks good"
echo ""

# Set secrets in Supabase
echo "🔐 Setting Supabase secrets..."
CHARIOW_SECRET=$(grep "CHARIOW_SECRET_KEY=" .env | cut -d'=' -f2)
PRODUCT_PRO=$(grep "VITE_CHARIOW_PRODUCT_ID_PRO=" .env | cut -d'=' -f2)
PRODUCT_INST=$(grep "VITE_CHARIOW_PRODUCT_ID_INSTITUTION=" .env | cut -d'=' -f2)

supabase secrets set \
    CHARIOW_SECRET_KEY="$CHARIOW_SECRET" \
    CHARIOW_PRODUCT_ID_PRO="$PRODUCT_PRO" \
    CHARIOW_PRODUCT_ID_INSTITUTION="$PRODUCT_INST" \
    --project-id "$PROJECT_ID"

echo "✅ Secrets configured"
echo ""

# Deploy Edge Functions
echo "📦 Deploying Edge Functions..."
supabase functions deploy chariow-checkout \
    --project-id "$PROJECT_ID"

echo "✅ Deployment complete"
echo ""

# Verify deployment
echo "🔍 Verifying deployment..."
supabase functions list --project-id "$PROJECT_ID"

echo ""
echo "✅ All done! Your Chariow integration is ready."
echo ""
echo "Next steps:"
echo "1. Start your app: npm run dev"
echo "2. Go to: http://localhost:5173/pricing"
echo "3. Test the checkout flow"
echo ""
echo "For troubleshooting, see: CHARIOW_SETUP.md"
