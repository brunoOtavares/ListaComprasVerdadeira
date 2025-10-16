
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = express();
const port = 3000;

// Firebase Admin SDK initialization
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, 'src', 'services', 'lista-de-compras-b5fed-firebase-adminsdk-fbsvc-0283bee0a1.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Substitua com seu Access Token do Mercado Pago
const accessToken = process.env.MP_ACCESS_TOKEN; // Use environment variable

const client = new MercadoPagoConfig({ accessToken });

app.use(cors());
app.use(express.json());

app.post('/create-preference', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Criando preferência para o usuário:', userId);

    const preference = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: 'Assinatura Premium',
          quantity: 1,
          unit_price: 11.00,
          currency_id: 'BRL',
        },
      ],
      external_reference: userId, // Pass userId to identify the user after payment
      back_urls: {
        success: `http://localhost:5173/payment-status?status=approved&user_id=${userId}`,
        failure: `http://localhost:5173/payment-status?status=failure&user_id=${userId}`,
        pending: `http://localhost:5173/payment-status?status=pending&user_id=${userId}`,
      },
      payment_methods: {
        excluded_payment_types: [
          {
            id: "credit_card"
          },
          {
            id: "debit_card"
          },
          {
            id: "ticket"
          },
          {
            id: "prepaid_card"
          }
        ],
        default_payment_method_id: "pix"
      },
    };

    console.log('Dados da preferência:', JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({
      body: preferenceData,
    });

    console.log('Preferência criada com sucesso:', result.id);
    res.json({ id: result.id, init_point: result.init_point, sandbox_init_point: result.sandbox_init_point });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento', details: error.message });
  }
});

// Webhook para receber notificações do Mercado Pago
app.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      // Aqui você faria uma chamada à API do Mercado Pago para obter detalhes do pagamento
      // Para simplificar, vamos assumir que o pagamento foi aprovado se o webhook for recebido
      // Em um ambiente de produção, você DEVE verificar o status do pagamento com a API do MP

      const externalReference = req.query.external_reference || req.body['data.external_reference']; // Mercado Pago pode enviar de diferentes formas
      const userId = externalReference;

      if (userId) {
        const userRef = db.collection('users').doc(userId);
        await userRef.update({ isPremium: true });
        console.log(`Usuário ${userId} atualizado para Premium.`);
      }
    }

    res.status(200).send('Webhook recebido com sucesso');
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// Rota para simular pagamento aprovado (apenas para testes)
app.post('/simulate-payment', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Simulando pagamento aprovado para o usuário:', userId);

    if (userId) {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        await userRef.update({ isPremium: true });
        console.log(`Usuário ${userId} atualizado para Premium (simulação).`);
      } else {
        // Criar o documento se não existir
        await userRef.set({
          isPremium: true,
          createdAt: new Date()
        });
        console.log(`Documento do usuário ${userId} criado e atualizado para Premium (simulação).`);
      }
      
      res.json({ success: true, message: 'Pagamento simulado com sucesso!' });
    } else {
      res.status(400).json({ error: 'ID do usuário não fornecido' });
    }
  } catch (error) {
    console.error('Erro ao simular pagamento:', error);
    res.status(500).json({ error: 'Erro ao simular pagamento' });
  }
});

// Endpoint para verificar o status do pagamento
app.get('/check-payment-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido' });
    }
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      res.json({ isPaid: userData.isPremium || false });
    } else {
      res.json({ isPaid: false });
    }
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
