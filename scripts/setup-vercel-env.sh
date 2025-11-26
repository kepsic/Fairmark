#!/bin/bash

# Script to add Firebase environment variables to Vercel
# Usage: ./scripts/setup-vercel-env.sh

echo "Setting up Vercel environment variables for Fairmark..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm i -g vercel"
    echo ""
    echo "Or add the environment variables manually via the Vercel dashboard:"
    echo "https://vercel.com/dashboard → Your Project → Settings → Environment Variables"
    exit 1
fi

echo "Adding environment variables to Vercel..."
echo ""

# Function to add env variable for all environments
add_env() {
    local key=$1
    local value=$2
    echo "Adding $key..."
    echo "$value" | vercel env add "$key" production preview development --yes
}

# Add all Firebase configuration variables
add_env "NEXT_PUBLIC_FIREBASE_API_KEY" "AIzaSyAxn_9Wf6XdwEzkDGUrn0V1tjmCIuLiedk"
add_env "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "fairmark-ed88f.firebaseapp.com"
add_env "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "fairmark-ed88f"
add_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "fairmark-ed88f.firebasestorage.app"
add_env "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "448499570962"
add_env "NEXT_PUBLIC_FIREBASE_APP_ID" "1:448499570962:web:49862419e43fee84777bcb"
add_env "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" "G-RHMJN8GER9"

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "Next steps:"
echo "1. Trigger a new deployment with: vercel --prod"
echo "2. Or push to GitHub to trigger automatic deployment"
echo "3. Visit https://fairmark-livid.vercel.app/ to verify"
