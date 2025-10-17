// scripts/setup-vercel-secrets.js
import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

console.log('🔧 Setting up Vercel secrets...\n');

const secrets = [
  { name: 'firebase-api-key', value: process.env.VITE_FIREBASE_API_KEY },
  { name: 'firebase-auth-domain', value: process.env.VITE_FIREBASE_AUTH_DOMAIN },
  { name: 'firebase-project-id', value: process.env.VITE_FIREBASE_PROJECT_ID },
  { name: 'firebase-storage-bucket', value: process.env.VITE_FIREBASE_STORAGE_BUCKET },
  { name: 'firebase-messaging-sender-id', value: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID },
  { name: 'firebase-app-id', value: process.env.VITE_FIREBASE_APP_ID },
  { name: 'backend-url', value: process.env.VITE_BACKEND_URL },
  { name: 'frontend-url', value: process.env.FRONTEND_URL }
];

try {
  // Check if Vercel CLI is installed
  console.log('📦 Checking Vercel CLI installation...');
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed\n');
  
  // Set secrets
  console.log('⚙️ Setting secrets for Production, Preview, and Development environments...\n');
  
  secrets.forEach(({ name, value }) => {
    if (value) {
      try {
        console.log(`Setting secret ${name}...`);
        // Remove the secret if it already exists
        try {
          execSync(`vercel env rm ${name} -y`, { stdio: 'pipe' });
          console.log(`  Removed existing ${name}`);
        } catch (e) {
          // Secret doesn't exist, which is fine
        }
        
        // Add the new secret
        execSync(`vercel env add ${name}`, { 
          stdio: 'pipe',
          input: `${value}\nproduction\npreview,development\n`
        });
        console.log(`✅ ${name} set successfully`);
      } catch (error) {
        console.log(`⚠️ ${name} might already exist or there was an issue setting it`);
        console.log(`   Error: ${error.message}`);
      }
    } else {
      console.log(`❌ ${name} is missing in .env file`);
    }
  });
  
  console.log('\n🎉 Vercel secrets setup completed!');
  console.log('💡 Make sure to redeploy your application after setting the secrets.');
  console.log('   You can do this by running: vercel --prod');
  console.log('\n📝 Note: The vercel.json file references these secrets using the @ prefix.');
  console.log('   These secrets will be available as environment variables during build time.');
  
} catch (error) {
  if (error.message.includes('vercel')) {
    console.error('❌ Vercel CLI is not installed.');
    console.log('Please install it by running: npm i -g vercel');
  } else {
    console.error('❌ An error occurred:', error.message);
  }
  process.exit(1);
}