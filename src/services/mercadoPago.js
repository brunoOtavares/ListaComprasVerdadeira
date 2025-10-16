// src/services/mercadoPago.js
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Preço da assinatura premium em reais
const PREMIUM_PRICE = 10.00;

// Função para criar uma preferência de pagamento no Mercado Pago
export const createPaymentPreference = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const requestBody = {
      items: [
        {
          title: 'Assinatura Premium - Lista de Compras',
          description: 'Acesso premium ao dashboard com funcionalidades avançadas',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: PREMIUM_PRICE,
        },
      ],
      external_reference: auth.currentUser.uid,
    };

    const response = await fetch('http://localhost:3000/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao criar preferência de pagamento');
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      lastPreferenceId: data.id,
      paymentPending: true,
    });

    return data;
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    throw error;
  }
};

// Função para iniciar o checkout do Mercado Pago
export const initiateCheckout = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }
    
    const preference = await createPaymentPreference();
    
    if (preference.init_point) {
      // Abre a página de pagamento em uma nova aba
      window.open(preference.init_point, '_blank');
      
      return { success: true, preference };
    } else {
      throw new Error('Não foi possível obter o link de pagamento');
    }
  } catch (error) {
    console.error('Erro ao iniciar checkout:', error);
    throw error;
  }
};
