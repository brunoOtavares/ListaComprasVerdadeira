
import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
const port = 3000;

// Substitua com seu Access Token do Mercado Pago
const accessToken = 'APP_USR-3321566781530128-101609-9bdf641f37bf70f6a8bd1352ce256057-215062504';

const client = new MercadoPagoConfig({ accessToken });

app.use(cors());
app.use(express.json());

app.post('/create-preference', async (req, res) => {
  try {
    const { items, external_reference } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        external_reference,
        back_urls: {
          success: `${req.headers.origin}/payment-status?status=approved`,
          failure: `${req.headers.origin}/payment-status?status=failure`,
          pending: `${req.headers.origin}/payment-status?status=pending`,
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
