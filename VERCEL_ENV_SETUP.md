# Vercel Environment Variables Setup

To ensure production has the Firebase keys, add these environment variables to your Vercel project:

## How to Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project (Fairmark)
3. Go to **Settings** → **Environment Variables**
4. Add each of the following variables:

## Required Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAxn_9Wf6XdwEzkDGUrn0V1tjmCIuLiedk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fairmark-ed88f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fairmark-ed88f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fairmark-ed88f.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=448499570962
NEXT_PUBLIC_FIREBASE_APP_ID=1:448499570962:web:49862419e43fee84777bcb
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-RHMJN8GER9
```

## Important Notes

- Set these for **Production**, **Preview**, and **Development** environments
- After adding the variables, redeploy your application or Vercel will automatically redeploy on your next git push
- The `NEXT_PUBLIC_` prefix makes these variables available in the browser

## Verification

After setting the variables:
1. Push any change to trigger a new deployment
2. Visit https://fairmark-livid.vercel.app/
3. Check the browser console - Firebase should initialize without errors
4. Try logging in with an existing user

## Alternative: Use Vercel CLI

If you have Vercel CLI installed, you can add them via command line:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production
```

## Security Note

These are public Firebase keys (prefixed with `NEXT_PUBLIC_`) and are safe to expose in the browser. Firebase security is handled by Firestore Security Rules, not by hiding these keys.
