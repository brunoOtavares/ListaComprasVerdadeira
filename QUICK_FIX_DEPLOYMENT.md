# Quick Fix for "Secret does not exist" Deployment Error

## Problem
Your deployment is failing with this error:
```
Deployment failed — Environment Variable "VITE_FIREBASE_API_KEY" references Secret "firebase-api-key", which does not exist.
```

## Why This Happens
Your `vercel.json` file is configured to use Vercel secrets (with @ prefix), but these secrets haven't been created in your Vercel account yet.

## Quick Solutions (Pick One)

### Solution 1: Create the Secrets (Recommended if you want to keep vercel.json)
1. Make sure you have a `.env` file with all the required variables from `.env.example`
2. Install Vercel CLI if you haven't: `npm i -g vercel`
3. Login to Vercel: `vercel login`
4. Run the secrets setup script: `npm run setup-vercel-secrets`
5. Deploy to production: `vercel --prod`

### Solution 2: Remove vercel.json and Use Environment Variables (Easiest)
1. Rename the `vercel.json` file to `vercel.json.backup`
2. Go to your Vercel project dashboard → Settings → Environment Variables
3. Add these environment variables:
   - `VITE_FIREBASE_API_KEY`: `AIzaSyCTZHv8LiuNuNcE2Edh0TnPIXCEEZBAPOQ`
   - `VITE_FIREBASE_AUTH_DOMAIN`: `lista-de-compras-b5fed.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: `lista-de-compras-b5fed`
   - `VITE_FIREBASE_STORAGE_BUCKET`: `lista-de-compras-b5fed.appspot.com`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: `928934741826`
   - `VITE_FIREBASE_APP_ID`: `1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c`
   - `MP_ACCESS_TOKEN`: `APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504`
   - `VITE_BACKEND_URL`: `https://your-backend-url.onrender.com`
   - `FRONTEND_URL`: `https://your-app.vercel.app`
4. Redeploy your application

### Solution 3: Simplify vercel.json
1. Replace the content of `vercel.json` with:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```
2. Follow Solution 2 to add environment variables in the Vercel dashboard
3. Redeploy your application

## After Fixing
1. Your deployment should succeed
2. Check the browser console to verify "Firebase initialized successfully" message
3. Test all features to ensure they work correctly

## Need More Help?
Check the full deployment guide in `DEPLOYMENT.md` for more detailed instructions.