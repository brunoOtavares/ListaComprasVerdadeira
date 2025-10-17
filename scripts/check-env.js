// scripts/check-env.js
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const requiredEnvVars = [
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

console.log('Checking environment variables...\n');

let allVarsSet = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName} is set`);
  } else {
    console.log(`❌ ${varName} is missing`);
    allVarsSet = false;
  }
});

if (allVarsSet) {
  console.log('\n✅ All required environment variables are set!');
  console.log('You can now deploy your application.');
} else {
  console.log('\n❌ Some environment variables are missing.');
  console.log('Please set them in your .env file or in your deployment platform.');
  process.exit(1);
}