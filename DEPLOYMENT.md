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
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables"
4. Add all the environment variables listed above
5. Redeploy your application

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

### Verification

After deployment, check the browser console to see if Firebase initializes successfully. You should see "Firebase initialized successfully" message if everything is configured correctly.

### Security Notes

- Never commit your `.env` file to version control
- Use different API keys for development and production if possible
- Regularly rotate your API keys
- Monitor your Firebase usage for any unusual activity