#!/bin/bash

# ============================================================================
# CHARIOW QUICK COMMANDS
# Common commands for managing Chariow payment integration
# ============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# DEPLOYMENT COMMANDS
# ============================================================================

echo -e "${BLUE}=== CHARIOW PAYMENT INTEGRATION - QUICK COMMANDS ===${NC}\n"

echo -e "${YELLOW}1️⃣  INITIAL SETUP${NC}"
echo "   Deploy everything in one go:"
echo "   $ chmod +x deploy-chariow.sh"
echo "   $ ./deploy-chariow.sh\n"

echo -e "${YELLOW}2️⃣  EDGE FUNCTIONS${NC}"
echo "   Start local development:"
echo "   $ supabase functions serve\n"
echo "   Deploy specific function:"
echo "   $ supabase functions deploy chariow-checkout --project-id YOUR_PROJECT_ID\n"
echo "   List deployed functions:"
echo "   $ supabase functions list --project-id YOUR_PROJECT_ID\n"
echo "   View logs:"
echo "   $ supabase functions logs chariow-checkout --project-id YOUR_PROJECT_ID --follow\n"

echo -e "${YELLOW}3️⃣  DATABASE SCHEMA${NC}"
echo "   Execute in Supabase SQL Editor:"
echo "   1. Copy contents of: sql/chariow_integration.sql"
echo "   2. Paste into new query"
echo "   3. Run (Alt+Enter)\n"
echo "   Verify tables created:"
echo "   SELECT * FROM information_schema.tables WHERE table_name LIKE 'subscription%'\n"

echo -e "${YELLOW}4️⃣  TESTING${NC}"
echo "   Test Edge Function with Postman/curl:"
echo "   $ curl -X POST http://localhost:54321/functions/v1/chariow-checkout \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"tier\": \"Pro\", \"userId\": \"test\", ...}'\n"
echo "   Test full flow in browser:"
echo "   1. npm run dev"
echo "   2. Go to http://localhost:5173/pricing"
echo "   3. Click 'S'abonner' and test checkout\n"

echo -e "${YELLOW}5️⃣  ENVIRONMENT${NC}"
echo "   Check configuration:"
echo "   $ grep CHARIOW .env\n"
echo "   Update secrets:"
echo "   $ supabase secrets set CHARIOW_SECRET_KEY=sk_... --project-id YOUR_PROJECT_ID\n"

echo -e "${YELLOW}6️⃣  DEBUGGING${NC}"
echo "   Check function status:"
echo "   $ supabase functions list\n"
echo "   View recent logs:"
echo "   $ supabase functions logs chariow-checkout --follow\n"
echo "   Restart local functions:"
echo "   $ supabase functions serve --no-cache\n"

echo -e "${YELLOW}7️⃣  PRODUCTION DEPLOYMENT${NC}"
echo "   Build app:"
echo "   $ npm run build\n"
echo "   Deploy Edge Functions:"
echo "   $ supabase functions deploy chariow-checkout --project-id PROD_ID"
echo "   $ supabase functions deploy chariow-webhook --project-id PROD_ID\n"

echo -e "${YELLOW}8️⃣  USEFUL QUERIES${NC}"
echo "   Check recent payments:"
echo "   $ SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 10;\n"
echo "   Get user's subscription:"
echo "   $ SELECT * FROM subscriptions WHERE user_id = 'USER_ID';\n"
echo "   Get payment events:"
echo "   $ SELECT * FROM payment_events WHERE user_id = 'USER_ID' ORDER BY created_at DESC;\n"

echo -e "${GREEN}=== DOCUMENTATION ===${NC}"
echo "   Main guide: CHARIOW_SETUP.md"
echo "   Complete reference: CHARIOW_COMPLETE.md"
echo "   Edge Functions: supabase/functions/README.md"
echo ""
echo -e "${GREEN}=== FILES ===${NC}"
echo "   Service: src/services/chariowService.ts"
echo "   Checkout page: src/pages/Pricing.tsx"
echo "   Success page: src/pages/CheckoutSuccess.tsx"
echo "   Edge Function: supabase/functions/chariow-checkout/index.ts"
echo "   DB Schema: sql/chariow_integration.sql"
echo ""

# ============================================================================
# SHORTCUTS
# ============================================================================

echo -e "${BLUE}=== HELPFUL SHORTCUTS ===${NC}\n"

# Install Supabase CLI if needed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}⚠️  Supabase CLI not installed${NC}"
    echo "   Install: npm install -g supabase"
    echo "   Or: scoop install supabase (Windows)"
    echo ""
fi

# Get project ID from config if available
PROJECT_ID=""
if [ -f ".env" ]; then
    PROJECT_ID=$(grep -i "SUPABASE_URL" .env | grep -oP 'https://\K[^.]+' || echo "")
fi

if [ -n "$PROJECT_ID" ]; then
    echo -e "${GREEN}✅ Project ID detected: $PROJECT_ID${NC}\n"
else
    echo -e "${YELLOW}ℹ️  Project ID not found. Set it in your commands:${NC}"
    echo "   export SUPABASE_PROJECT_ID=your_project_id"
    echo ""
fi

echo -e "${BLUE}=== READY TO GO! ===${NC}\n"
echo "Next step:"
echo "  1. Make sure .env is configured"
echo "  2. Run: ./deploy-chariow.sh"
echo "  3. Test at: http://localhost:5173/pricing"
echo ""
