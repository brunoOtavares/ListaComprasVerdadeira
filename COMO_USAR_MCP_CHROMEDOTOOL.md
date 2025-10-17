# Como Usar o MCP ChromeDevTool Diretamente

## O que é MCP ChromeDevTool?

O MCP (Model Context Protocol) ChromeDevTool é uma ferramenta que permite interagir com o Chrome DevTools programaticamente, possibilitando automação de tarefas de desenvolvimento, testes e depuração.

## Instalação

O MCP ChromeDevTool já está instalado globalmente no seu sistema:
```bash
npm install -g chrome-devtools-mcp
```

## Configuração

O arquivo de configuração foi criado em:
```
C:\Users\matav\AppData\Roaming\Claude\claude_desktop_config.json
```

Com o seguinte conteúdo:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "chrome-devtools-mcp",
      "args": ["--headless"]
    }
  }
}
```

## Como Usar

### 1. Modo Interativo (Recomendado para desenvolvimento)

Para usar o MCP ChromeDevTool com seu aplicativo React que está rodando em http://localhost:5173:

```bash
chrome-devtools-mcp --headless
```

Isso iniciará o Chrome em modo headless e permitirá que você interaja com seu aplicativo através do MCP.

### 2. Conectar a uma instância existente do Chrome

Se você já tem o Chrome aberto com depuração remota ativada:

```bash
chrome-devtools-mcp --browserUrl http://127.0.0.1:9222
```

### 3. Usar com diferentes canais do Chrome

```bash
# Usar Chrome Beta
chrome-devtools-mcp --channel beta

# Usar Chrome Canary
chrome-devtools-mcp --channel canary

# Usar Chrome Dev
chrome-devtools-mcp --channel dev
```

### 4. Configurar tamanho da viewport

```bash
chrome-devtools-mcp --viewport 1280x720
```

## Exemplos de Uso com seu Aplicativo React

### Inspecionar Elementos

Com o MCP ChromeDevTool rodando, você pode:

1. Navegar até http://localhost:5173
2. Inspecionar elementos do DOM:
   ```javascript
   document.querySelector("#root")
   ```

### Depurar Código React

1. Acessar componentes React:
   ```javascript
   // Verificar se o React está disponível
   window.React
   
   // Acessar o estado dos componentes
   document.querySelector('[data-reactroot]')
   ```

### Monitorar Rede

1. Observar requisições de rede:
   ```javascript
   // Monitorar requisições fetch
   const originalFetch = window.fetch;
   window.fetch = function(...args) {
     console.log('Fetch request:', args);
     return originalFetch.apply(this, args);
   };
   ```

### Testar Firebase

1. Verificar a conexão com o Firebase:
   ```javascript
   // Verificar se o Firebase foi inicializado
   firebase.apps.length
   ```

## Integração com Claude Desktop

Com a configuração criada, o Claude Desktop poderá usar o MCP ChromeDevTool automaticamente quando necessário. Para isso:

1. Reinicie o Claude Desktop (se estiver em execução)
2. O MCP ChromeDevTool estará disponível como uma ferramenta

## Dicas Úteis

1. **Modo headless vs modo visual**: Use `--headless` para automação, ou omita para ver o navegador
2. **Logs**: Use `--logFile caminho/do/arquivo.log` para salvar logs de depuração
3. **Segurança**: Tenha cuidado ao compartilhar informações sensíveis através do MCP

## Solução de Problemas

Se encontrar problemas:

1. Verifique se o Chrome está instalado
2. Certifique-se de que seu aplicativo está rodando em http://localhost:5173
3. Verifique o arquivo de configuração em `%APPDATA%\Claude\claude_desktop_config.json`

## Exemplo Completo

Para usar o MCP ChromeDevTool com seu aplicativo de lista de compras:

```bash
# 1. Inicie o MCP ChromeDevTool
chrome-devtools-mcp --headless

# 2. Em outro terminal, verifique se o aplicativo está rodando
curl http://localhost:5173

# 3. O MCP ChromeDevTool estará pronto para interagir com seu aplicativo
```

Isso permitirá que você automatize testes, inspecione elementos e depure seu aplicativo React de forma programática.