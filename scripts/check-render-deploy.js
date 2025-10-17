// scripts/check-render-deploy.js
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: join(__dirname, '../.env') });

console.log('🔍 Verificando preparação para deploy no Render...\n');

const checks = [
  {
    name: 'Arquivo server.js',
    check: () => fs.existsSync(join(__dirname, '../server.js')),
    errorMsg: 'server.js não encontrado'
  },
  {
    name: 'Package.json',
    check: () => {
      const packagePath = join(__dirname, '../package.json');
      if (!fs.existsSync(packagePath)) return false;
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      return pkg.dependencies && pkg.dependencies.express;
    },
    errorMsg: 'package.json não encontrado ou sem dependência express'
  },
  {
    name: 'Arquivo de credenciais do Firebase',
    check: () => fs.existsSync(join(__dirname, '../src/services/lista-de-comr-firebase-adminsdk.json')),
    errorMsg: 'Arquivo JSON do Firebase Admin não encontrado em src/services/'
  },
  {
    name: 'Variável MP_ACCESS_TOKEN no .env',
    check: () => !!process.env.MP_ACCESS_TOKEN,
    errorMsg: 'MP_ACCESS_TOKEN não está configurada no .env'
  },
  {
    name: 'Render.yaml',
    check: () => fs.existsSync(join(__dirname, '../render.yaml')),
    errorMsg: 'render.yaml não encontrado'
  }
];

let allChecksPassed = true;

checks.forEach(({ name, check, errorMsg }) => {
  try {
    if (check()) {
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}: ${errorMsg}`);
      allChecksPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Erro ao verificar - ${error.message}`);
    allChecksPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allChecksPassed) {
  console.log('🎉 Seu backend está pronto para o deploy no Render!');
  console.log('\nPróximos passos:');
  console.log('1. Faça commit das alterações');
  console.log('2. Siga as instruções em DEPLOY_RENDER.md');
  console.log('3. Após o deploy, atualize VITE_BACKEND_URL no Vercel');
} else {
  console.log('❌ Corrija os erros acima antes de fazer o deploy');
  process.exit(1);
}

// Verificar configuração do CORS
console.log('\n📋 Configuração de CORS:');
console.log(`- FRONTEND_URL atual: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
console.log('- Lembre-se de atualizar esta variável no Render para a URL do seu frontend no Vercel');