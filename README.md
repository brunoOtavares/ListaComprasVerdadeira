# Lista de Compras

Uma aplicação de lista de compras com funcionalidades premium, integrada com Firebase para autenticação e armazenamento de dados, e Mercado Pago para pagamentos.

## Funcionalidades

- Autenticação de usuários com Firebase
- Criação e gerenciamento de listas de compras
- Histórico de compras
- Sistema de assinatura premium com Mercado Pago
- Dashboard com estatísticas para usuários premium
- Interface responsiva e moderna

## Tecnologias Utilizadas

- React
- Vite
- Firebase (Autenticação e Firestore)
- Mercado Pago API
- Express.js (backend)
- Chart.js (para gráficos no dashboard)

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/brunoOtavares/ListaComprasVerdadeira.git
   cd ListaComprasVerdadeira
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis de ambiente com suas credenciais

4. Configure o Firebase:
   - Crie um projeto no Firebase Console
   - Copie as credenciais do projeto para o arquivo `.env`
   - Baixe a chave de serviço do Firebase Admin SDK e coloque em `src/services/`

5. Configure o Mercado Pago:
   - Crie uma conta no Mercado Pago
   - Obtenha seu access token e configure no `.env`

## Executando a Aplicação

1. Verifique se todas as variáveis de ambiente estão configuradas:
   ```bash
   npm run check-env
   ```

2. Inicie o servidor backend:
   ```bash
   npm run server
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em `http://localhost:5173`

## Deploy

### Preparação para Deploy

Antes de fazer o deploy, execute o script de preparação que verifica as variáveis de ambiente e builda o projeto:

```bash
npm run pre-deploy
```

### Deploy no GitHub Pages

1. Execute o script de preparação:
   ```bash
   npm run pre-deploy
   ```

2. Faça o deploy para o GitHub Pages usando o GitHub Actions ou manualmente.

### Notas sobre o Deploy

- O backend (Express.js) deve ser implantado em um serviço como Heroku, Vercel ou Render
- O frontend pode ser implantado no GitHub Pages, Vercel ou Netlify
- Certifique-se de configurar as variáveis de ambiente corretamente no ambiente de produção

## Solução de Problemas

### Erro: Firebase: Error (auth/invalid-api-key)

Este erro ocorre quando as variáveis de ambiente do Firebase não estão configuradas corretamente no ambiente de produção.

**Solução:**
1. Verifique se todas as variáveis de ambiente do Firebase estão definidas
2. Use `npm run check-env` para verificar localmente
3. Configure as variáveis de ambiente na sua plataforma de deploy (Vercel, Netlify, etc.)
4. Para mais detalhes, consulte o arquivo [DEPLOYMENT.md](DEPLOYMENT.md)

### Variáveis de Ambiente Necessárias

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `MP_ACCESS_TOKEN`
- `VITE_BACKEND_URL`

## Estrutura do Projeto

```
src/
├── Components/          # Componentes React
├── lib/                # Configuração do Firebase
├── services/           # Serviços e APIs
├── utils/              # Utilitários
└── styles/             # Estilos globais
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT.