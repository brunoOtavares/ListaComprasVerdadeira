// scripts/pre-deploy.js
import { execSync } from 'child_process';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

console.log('🚀 Starting pre-deployment checks...\n');

try {
  // Check environment variables
  console.log('1️⃣ Checking environment variables...');
  execSync('npm run check-env', { stdio: 'inherit' });
  
  // Build the project
  console.log('\n2️⃣ Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Pre-deployment checks completed successfully!');
  console.log('🎉 Your application is ready for deployment!');
  
} catch (error) {
  console.error('\n❌ Pre-deployment checks failed:');
  console.error(error.message);
  process.exit(1);
}