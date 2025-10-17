// scripts/setup-vercel-env.js
import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

console.log('🔧 Setting up Vercel environment variables...\n');

const envVars = [
  { name: 'VITE_FIREBASE_API_KEY', value: process.env.VITE_FIREBASE_API_KEY },
  { name: 'VITE_FIREBASE_AUTH_DOMAIN', value: process.env.VITE_FIREBASE_AUTH_DOMAIN },
  { name: 'VITE_FIREBASE_PROJECT_ID', value: process.env.VITE_FIREBASE_PROJECT_ID },
  { name: 'VITE_FIREBASE_STORAGE_BUCKET', value: process.env.VITE_FIREBASE_STORAGE_BUCKET },
  { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID },
  { name: 'VITE_FIREBASE_APP_ID', value: process.env.VITE_FIREBASE_APP_ID },
  { name: 'MP_ACCESS_TOKEN', value: process.env.MP_ACCESS_TOKEN },
  { name: 'VITE_BACKEND_URL', value: process.env.VITE_BACKEND_URL },
  { name: 'FRONTEND_URL', value: process.env.FRONTEND_URL }
];

try {
  // Check if Vercel CLI is installed
  console.log('📦 Checking Vercel CLI installation...');
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed\n');
  
  // Set environment variables
  console.log('⚙️ Setting environment variables for Production, Preview, and Development environments...\n');
  
  envVars.forEach(({ name, value }) => {
    if (value) {
      try {
        console.log(`Setting ${name}...`);
        execSync(`vercel env add ${name}`, { 
          stdio: 'pipe',
          input: `${value}\nproduction\npreview,development\n`
        });
        console.log(`✅ ${name} set successfully`);
      } catch (error) {
        console.log(`⚠️ ${name} might already exist or there was an issue setting it`);
      }
    } else {
      console.log(`❌ ${name} is missing in .env file`);
    }
  });
  
  console.log('\n🎉 Environment variables setup completed!');
  console.log('💡 Make sure to redeploy your application after setting the environment variables.');
  console.log('   You can do this by running: vercel --prod');
  
} catch (error) {
  if (error.message.includes('vercel')) {
    console.error('❌ Vercel CLI is not installed.');
    console.log('Please install it by running: npm i -g vercel');
  } else {
    console.error('❌ An error occurred:', error.message);
  }
  process.exit(1);
}