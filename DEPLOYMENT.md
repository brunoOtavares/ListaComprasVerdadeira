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

# Frontend URL (para callbacks do Mercado Pago)
FRONTEND_URL="https://your-vercel-app.vercel.app"
```

### Platform-Specific Instructions

#### Vercel

**Option 1: Using Vercel Dashboard (Manual - Recommended)**
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
   - FRONTEND_URL: https://your-vercel-app.vercel.app
5. Make sure to select the appropriate environments (Production, Preview, Development)
6. Redeploy your application using the "Redeploy" button or by pushing a new commit

**Option 2: Using Vercel CLI with Environment Variables (Automated)**
1. Install Vercel CLI if you haven't already: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Run the setup script: `npm run setup-vercel-env`
4. Deploy to production: `vercel --prod`

**Option 3: Using Vercel CLI with Secrets (For vercel.json configuration)**
1. Install Vercel CLI if you haven't already: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Make sure you have a `.env` file with all the required environment variables
4. Run the secrets setup script: `npm run setup-vercel-secrets`
5. Deploy to production: `vercel --prod`

**Important Note about vercel.json**:
If you're using the vercel.json file configuration (which references secrets with @ prefix), you MUST use Option 3 to set up the secrets. The vercel.json file expects these secrets to exist in your Vercel account:

```json
"VITE_FIREBASE_API_KEY": "@firebase-api-key"
```

This references a secret named "firebase-api-key" that must be created in your Vercel account.

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

### Fixing "Secret does not exist" Error

If you're getting an error like:
```
Deployment failed — Environment Variable "VITE_FIREBASE_API_KEY" references Secret "firebase-api-key", which does not exist.
```

This happens when your `vercel.json` file references secrets that haven't been created in your Vercel account. Here's how to fix it:

**Option 1: Create the required secrets**
1. Make sure you have a `.env` file with all the required variables
2. Run: `npm run setup-vercel-secrets`
3. Redeploy: `vercel --prod`

**Option 2: Remove vercel.json and use environment variables directly**
1. Delete or rename the `vercel.json` file
2. Follow "Option 1" above to set environment variables in the Vercel dashboard
3. Redeploy your application

**Option 3: Update vercel.json to not use secrets**
Replace the `vercel.json` content with:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```
Then set environment variables in the Vercel dashboard as shown in Option 1.

### Troubleshooting Common Errors in Vercel

#### Firebase API Key Error

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

#### Mercado Pago "Failed to fetch" Error

If you're seeing "Erro ao solicitar preferência de pagamento: Failed to fetch" after deployment:

1. **Backend URL Configuration**:
   - Make sure `VITE_BACKEND_URL` is set to your production backend URL
   - Update it from `http://localhost:3000` to your deployed backend URL
   - Example: `https://your-backend.herokuapp.com` or `https://your-api.vercel.app`

2. **Backend Deployment**:
   - Ensure your backend server is deployed and accessible
   - The backend must be deployed separately from the frontend
   - Common options: Heroku, Railway, Vercel Serverless, Render

3. **CORS Configuration**:
   - Make sure your backend allows requests from your Vercel frontend
   - Update the CORS configuration in your backend to include your Vercel domain

4. **Frontend URL Configuration**:
   - Set `FRONTEND_URL` to your Vercel app URL
   - This is used for Mercado Pago callbacks
   - Example: `https://your-app.vercel.app`

5. **Test Backend Connectivity**:
   - Try accessing your backend endpoint directly in the browser
   - Check if `/create-preference` endpoint is accessible
   - Verify the backend is running and not crashed

### Verification

After deployment, check the browser console to see if Firebase initializes successfully. You should see "Firebase initialized successfully" message if everything is configured correctly.

### Security Notes

- Never commit your `.env` file to version control
- Use different API keys for development and production if possible
- Regularly rotate your API keys
- Monitor your Firebase usage for any unusual activity