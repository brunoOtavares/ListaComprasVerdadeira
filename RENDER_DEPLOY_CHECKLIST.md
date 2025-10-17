# Checklist Deploy Backend no Render

## ✅ Arquivos Criados/Atualizados

1. **render.yaml** - Configuração do serviço Render
2. **server.js** - Atualizado com CORS e PORT dinâmica
3. **DEPLOY_RENDER.md** - Guia completo de deploy
4. **scripts/check-render-deploy.js** - Script de verificação
5. **package.json** - Novo script `check-render-deploy`

## 🚀 Passos para Deploy

### 1. Verificar Preparação
```bash
npm run check-render-deploy
```

### 2. Fazer Commit no GitHub
```bash
git add .
git commit -m "Preparando backend para deploy no Render"
git push origin main
```

### 3. Configurar no Render
1. Acesse https://render.com
2. Conecte sua conta GitHub
3. Crie novo "Web Service"
4. Selecione seu repositório
5. Use as configurações do render.yaml

### 4. Variáveis de Ambiente no Render
```
NODE_ENV=production
MP_ACCESS_TOKEN=APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504
FRONTEND_URL=https://seu-app.vercel.app
```

### 5. Atualizar Vercel
Após o deploy, atualize a variável `VITE_BACKEND_URL` no Vercel:
```
VITE_BACKEND_URL=https://seu-backend.onrender.com
```

## ⚠️ Importante

- O arquivo JSON do Firebase está no .gitignore, então você precisará:
  1. Fazer upload manualmente no Render, OU
  2. Usar Render Environment Variables para as credenciais

- O plano free do Render desativa após 15 minutos de inatividade
- A primeira ativação pode levar até 30 segundos

## 🔧 URLs Após Deploy

- Backend: `https://seu-backend.onrender.com`
- Frontend: `https://seu-app.vercel.app`
- Webhook Mercado Pago: `https://seu-backend.onrender.com/webhook`

## 🧪 Testes Após Deploy

1. Teste o endpoint: `https://seu-backend.onrender.com/`
2. Teste criar preferência: POST `/create-preference`
3. Verifique logs no Render se houver erro