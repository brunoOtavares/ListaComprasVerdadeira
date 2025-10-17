// scripts/test-deployment-setup.js
import { config } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

// Load environment variables from .env file
config();

console.log('🧪 Testing deployment setup...\n');

// Check if .env file exists
if (!existsSync('.env')) {
  console.log('❌ .env file not found');
  console.log('💡 Please create a .env file based on .env.example');
  process.exit(1);
}
console.log('✅ .env file exists');

// Check required environment variables
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'MP_ACCESS_TOKEN',
  'VITE_BACKEND_URL',
  'FRONTEND_URL'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ Missing environment variable: ${varName}`);
    allVarsPresent = false;
  } else {
    console.log(`✅ ${varName} is set`);
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Some required environment variables are missing');
  process.exit(1);
}

// Check if vercel.json exists
if (existsSync('vercel.json')) {
  console.log('\n✅ vercel.json exists');
  
  try {
    // Parse vercel.json to check if it uses secrets
    const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
    
    if (vercelConfig.env) {
      const usesSecrets = Object.values(vercelConfig.env).some(value => 
        typeof value === 'string' && value.startsWith('@')
      );
      
      if (usesSecrets) {
        console.log('⚠️ vercel.json uses secrets (@ notation)');
        console.log('💡 Make sure to run: npm run setup-vercel-secrets');
        console.log('💡 Or follow QUICK_FIX_DEPLOYMENT.md to fix the deployment issue');
      } else {
        console.log('✅ vercel.json uses regular environment variables');
        console.log('💡 Make sure to set these variables in your Vercel dashboard');
      }
    }
  } catch (error) {
    console.log('❌ Error reading vercel.json:', error.message);
  }
} else {
  console.log('\n⚠️ vercel.json not found');
  console.log('💡 Make sure to set environment variables in your Vercel dashboard');
}

// Check if package.json has the necessary scripts
try {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts['setup-vercel-secrets']) {
    console.log('\n✅ setup-vercel-secrets script exists in package.json');
  } else {
    console.log('\n❌ setup-vercel-secrets script missing from package.json');
  }
} catch (error) {
  console.log('\n❌ Error reading package.json:', error.message);
}

console.log('\n🎉 Deployment setup test completed!');
console.log('\n📝 Next steps:');
if (existsSync('vercel.json')) {
  console.log('1. Run: npm run setup-vercel-secrets');
  console.log('2. Deploy: vercel --prod');
} else {
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Deploy: vercel --prod');
}