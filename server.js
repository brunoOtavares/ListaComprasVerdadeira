
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = express();
const port = 3000;

// Firebase Admin SDK initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

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

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: 'Assinatura Premium',
            quantity: 1,
            unit_price: 10.00,
          },
        ],
        external_reference: userId, // Pass userId to identify the user after payment
        back_urls: {
          success: `${req.headers.origin}/payment-status?status=approved&user_id=${userId}`,
          failure: `${req.headers.origin}/payment-status?status=failure&user_id=${userId}`,
          pending: `${req.headers.origin}/payment-status?status=pending&user_id=${userId}`,
        },
        auto_return: 'approved',
      },
    });

    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
