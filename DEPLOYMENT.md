# Deployment Guide

## Environment Variables Setup

To fix the "Firebase: Error (auth/invalid-api-key)" error in production, you need to properly configure the environment variables in your hosting platform.

### Required Environment Variables

Make sure to set the following environment variables in your production environment:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY="AIzaSyCTZHv8LiuNuNcE2Edh0TnPIXCEEZBAPOQ"
VITE_FIREBASE_AUTH_DOMAIN="lista-de-compras-b5fed.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="lista-de-compras-b5fed"
VITE_FIREBASE_STORAGE_BUCKET="lista-de-compras-b5fed.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="928934741826"
VITE_FIREBASE_APP_ID="1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c"

# Mercado Pago Configuration
MP_ACCESS_TOKEN="APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504"

# Backend URL (update with your production backend URL)
VITE_BACKEND_URL="https://your-production-backend-url.com"
```

### Platform-Specific Instructions

#### Vercel

**Option 1: Using Vercel Dashboard (Manual)**
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables"
4. Add all the environment variables listed above with these exact values:
   - VITE_FIREBASE_API_KEY: AIzaSyCTZHv8LiuNuNcE2Edh0TnPIXCEEZBAPOQ
   - VITE_FIREBASE_AUTH_DOMAIN: lista-de-compras-b5fed.firebaseapp.com
   - VITE_FIREBASE_PROJECT_ID: lista-de-compras-b5fed
   - VITE_FIREBASE_STORAGE_BUCKET: lista-de-compras-b5fed.appspot.com
   - VITE_FIREBASE_MESSAGING_SENDER_ID: 928934741826
   - VITE_FIREBASE_APP_ID: 1:928934741826:web:7f6b6c9c7c6c9c7c6c9c7c
   - MP_ACCESS_TOKEN: APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504
   - VITE_BACKEND_URL: https://your-production-backend-url.com
5. Make sure to select the appropriate environments (Production, Preview, Development)
6. Redeploy your application using the "Redeploy" button or by pushing a new commit

**Option 2: Using Vercel CLI (Automated)**
1. Install Vercel CLI if you haven't already: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Run the setup script: `npm run setup-vercel-env`
4. Deploy to production: `vercel --prod`

#### Netlify
1. Go to your Netlify site dashboard
2. Click on "Site settings" → "Build & deploy" → "Environment"
3. Add all the environment variables listed above
4. Redeploy your application

#### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` to authenticate
3. Run `firebase init hosting` in your project
4. Create a `.firebaserc` file with your project ID
5. Set environment variables in Firebase console or use `firebase functions:config:set`
6. Deploy with `firebase deploy`

#### Docker/Custom Server
1. Create a production `.env` file on your server
2. Make sure to source the environment variables before starting your application
3. Or use Docker environment variables or secrets management

### Common Issues

1. **Missing API Key**: The most common issue is not setting the `VITE_FIREBASE_API_KEY` in production
2. **Incorrect Variable Names**: Make sure all variable names match exactly (including `VITE_` prefix)
3. **Build Process**: Some platforms require a rebuild after changing environment variables
4. **CORS Issues**: Make sure your Firebase project allows your production domain

### Troubleshooting Firebase API Key Error in Vercel

If you're seeing "Firebase: Error (auth/invalid-api-key)" in your Vercel deployment:

1. **Check Environment Variables in Vercel Dashboard**:
   - Go to your Vercel project → Settings → Environment Variables
   - Ensure ALL Firebase variables are set for the Production environment
   - Variable names must EXACTLY match (including VITE_ prefix)

2. **Verify VITE Prefix**:
   - Vite only exposes environment variables that start with VITE_ to the frontend
   - Make sure all your Firebase variables have the VITE_ prefix

3. **Redeploy After Changes**:
   - After setting environment variables, you must redeploy
   - Go to your project → Deployments → Click the three dots → Redeploy

4. **Check Build Logs**:
   - Look at the build logs to see if environment variables are being loaded correctly
   - You should see "Firebase initialized successfully" in the console if configured correctly

5. **Firebase Console Settings**:
   - Ensure your Firebase project allows your Vercel domain
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add your Vercel deployment URL (e.g., your-app.vercel.app)

### Verification

After deployment, check the browser console to see if Firebase initializes successfully. You should see "Firebase initialized successfully" message if everything is configured correctly.

### Security Notes

- Never commit your `.env` file to version control
- Use different API keys for development and production if possible
- Regularly rotate your API keys
- Monitor your Firebase usage for any unusual activity