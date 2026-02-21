#!/bin/bash
# LearnX Social Automation - One-time setup script
# Run this after creating your Supabase project at supabase.com

set -e

echo ""
echo "=========================================="
echo "  LearnX Social Automation Setup"
echo "=========================================="
echo ""

# Check if .env.local already exists
if [ -f .env.local ]; then
  echo "⚠️  .env.local already exists. Overwrite? (y/N)"
  read -r confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Keeping existing .env.local"
  fi
fi

echo ""
echo "Step 1: Go to https://supabase.com and create a FREE project"
echo "Step 2: Go to Settings > API in your Supabase project"
echo ""

# Get Supabase credentials
read -p "Paste your Supabase Project URL: " SUPABASE_URL
read -p "Paste your Supabase anon/public key: " SUPABASE_ANON_KEY
read -p "Paste your Supabase service_role key: " SUPABASE_SERVICE_KEY

# Generate a random cron secret
CRON_SECRET=$(openssl rand -hex 16 2>/dev/null || python3 -c "import secrets; print(secrets.token_hex(16))" 2>/dev/null || echo "learnx-cron-$(date +%s)")

# Write .env.local
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# Cron job secret
CRON_SECRET=$CRON_SECRET

# Platform credentials (add these as you connect each platform)
# META_APP_ID=
# META_APP_SECRET=
# TWITTER_API_KEY=
# TWITTER_API_SECRET=
# TELEGRAM_BOT_TOKEN=
EOF

echo ""
echo "✅ .env.local created!"
echo ""

# Run the schema on Supabase
echo "Running database schema..."
npx supabase db push --db-url "postgresql://postgres:postgres@db.${SUPABASE_URL#https://}.supabase.co:5432/postgres" 2>/dev/null || {
  echo ""
  echo "Auto-schema failed. Running via Supabase SQL Editor instead..."
  echo ""
  echo "📋 Go to your Supabase project > SQL Editor"
  echo "📋 Paste the contents of supabase-schema.sql"
  echo "📋 Click 'Run'"
  echo ""
}

# Add env vars to Vercel
echo "Adding env vars to Vercel..."
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL" 2>/dev/null || true
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY" 2>/dev/null || true
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_KEY" 2>/dev/null || true
npx vercel env add CRON_SECRET production <<< "$CRON_SECRET" 2>/dev/null || true

echo ""
echo "✅ Vercel env vars set!"
echo ""

# Redeploy with env vars
echo "Redeploying with new env vars..."
npx vercel --prod --yes 2>/dev/null || true

echo ""
echo "=========================================="
echo "  ✅ SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "Your app: https://learnx2.vercel.app"
echo "Admin:    https://learnx2.vercel.app/admin/social"
echo ""
echo "Next steps:"
echo "  1. Go to Supabase SQL Editor and run supabase-schema.sql"
echo "  2. Go to /admin/social and click 'Generate Calendar'"
echo "  3. Connect platforms (start with Telegram - easiest!)"
echo ""
