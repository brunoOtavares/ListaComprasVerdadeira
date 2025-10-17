# Deploy do Backend no Render

Este guia explica como fazer o deploy do seu backend Node.js no Render.

## Pré-requisitos

1. Uma conta no Render (https://render.com)
2. Seu código no GitHub
3. Variáveis de ambiente do Mercado Pago

## Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que seu repositório contém:
- `server.js` - Seu servidor Express
- `package.json` - Com as dependências corretas
- `render.yaml` - Configuração do serviço (já criado)
- `src/services/lista-de-compras-b5fed-firebase-adminsdk-fbsvc-0283bee0a1.json` - Credenciais do Firebase

### 2. Configurar o Render

1. Faça login no Render com sua conta GitHub
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:
   - **Name**: lista-compras-backend (ou o nome que preferir)
   - **Environment**: Node
   - **Region**: A mais próxima de você
   - **Branch**: main (ou sua branch principal)
   - **Root Directory**: Deixe em branco
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (para começar)

### 3. Configurar Variáveis de Ambiente

Na seção "Environment" do seu serviço, adicione as seguintes variáveis:

```
NODE_ENV=production
MP_ACCESS_TOKEN=APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504
FRONTEND_URL=https://seu-app.vercel.app
```

**Importante**: Substitua `https://seu-app.vercel.app` pela URL real do seu frontend no Vercel.

### 4. Deploy

1. Clique em "Create Web Service"
2. Aguarde o build e o deploy
3. Anote a URL do seu backend (ex: https://lista-compras-backend.onrender.com)

### 5. Atualizar Variáveis no Vercel

1. Vá para o dashboard do Vercel
2. Settings → Environment Variables
3. Atualize a variável `VITE_BACKEND_URL` com a URL do seu backend no Render:
   ```
   VITE_BACKEND_URL=https://lista-compras-backend.onrender.com
   ```
4. Faça um novo deploy do frontend

## Configuração de CORS

O servidor já está configurado para aceitar requisições do seu frontend através da variável `FRONTEND_URL`. Certifique-se de que esta variável esteja configurada corretamente no Render.

## Troubleshooting

### Erro: "Cannot find module"
- Verifique se o `package.json` está correto
- Certifique-se de que todas as dependências estão listadas

### Erro: "Permission denied"
- Verifique se o arquivo JSON do Firebase está no repositório
- Certifique-se de que o caminho está correto

### Erro: "CORS policy"
- Verifique se a variável `FRONTEND_URL` está configurada corretamente
- Certifique-se de que a URL do frontend está incluída

### Aplicação não inicia
- Verifique os logs no Render
- Confirme se a porta está configurada para usar `process.env.PORT`

## Webhook do Mercado Pago

Se você precisar receber webhooks do Mercado Pago:

1. No dashboard do Mercado Pago, vá para "Webhooks"
2. Adicione a URL: `https://seu-backend.onrender.com/webhook`
3. Configure os eventos que deseja receber

## Limitações do Plano Free

- O plano free do Render desativa a aplicação após 15 minutos de inatividade
- A aplicação pode levar até 30 segundos para acordar
- Para produção, considere um plano pago

## Próximos Passos

1. Teste todos os endpoints do seu backend
2. Verifique se o pagamento está funcionando
3. Monitore os logs para identificar possíveis erros
4. Configure monitoramento se necessário