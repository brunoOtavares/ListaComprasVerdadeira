// Exemplo de como usar o MCP ChromeDevTool diretamente
// Este script mostra como conectar-se ao Chrome e interagir com sua aplicação

import { spawn } from 'child_process';
import http from 'http';

// Função para iniciar o MCP ChromeDevTool e conectar-se ao seu aplicativo
function startMCPChromeDevTool() {
  console.log('Iniciando MCP ChromeDevTool...');
  
  // Inicia o MCP ChromeDevTool em modo headless
  const mcpProcess = spawn('C:\\Users\\matav\\AppData\\Roaming\\npm\\chrome-devtools-mcp.cmd', ['--headless'], {
    stdio: 'inherit'
  });
  
  mcpProcess.on('error', (error) => {
    console.error(`Erro ao iniciar MCP ChromeDevTool: ${error.message}`);
  });
  
  mcpProcess.on('close', (code) => {
    console.log(`MCP ChromeDevTool encerrado com código ${code}`);
  });
  
  return mcpProcess;
}

// Função para testar a conexão com o aplicativo
function testAppConnection() {
  const options = {
    hostname: 'localhost',
    port: 5173,
    path: '/',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`Status do aplicativo: ${res.statusCode}`);
    console.log('Aplicativo está respondendo corretamente!');
  });
  
  req.on('error', (e) => {
    console.error(`Problema com a requisição: ${e.message}`);
  });
  
  req.end();
}

// Exemplo de como usar o MCP ChromeDevTool com seu aplicativo
function demonstrateUsage() {
  console.log('=== Demonstração de uso do MCP ChromeDevTool ===\n');
  
  console.log('1. Verificando se o aplicativo está rodando...');
  testAppConnection();
  
  console.log('\n2. Iniciando MCP ChromeDevTool...');
  console.log('Isso permitirá que você interaja com seu aplicativo React através do Chrome DevTools');
  
  const mcpProcess = startMCPChromeDevTool();
  
  console.log('\n3. Para usar o MCP ChromeDevTool com seu aplicativo:');
  console.log('   - O MCP ChromeDevTool está rodando em modo headless');
  console.log('   - Você pode configurá-lo para se conectar ao seu aplicativo em http://localhost:5173');
  console.log('   - Use as ferramentas do Chrome DevTools para inspecionar elementos');
  console.log('   - Execute JavaScript no console do navegador');
  console.log('   - Depure seu código React');
  
  console.log('\n4. Exemplos de comandos que você pode usar:');
  console.log('   - Inspecionar elementos: document.querySelector("#root")');
  console.log('   - Ver estado do React: React.createElement');
  console.log('   - Monitorar rede: fetch(url)');
  console.log('   - Depurar performance: performance.now()');
  
  // Encerra o processo após 10 segundos para demonstração
  setTimeout(() => {
    console.log('\nEncerrando demonstração...');
    mcpProcess.kill();
  }, 10000);
}

// Executa a demonstração
demonstrateUsage();