// src/services/stripe.js
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Preço da assinatura premium em reais
const PREMIUM_PRICE_CENTS = 1000; // R$10,00 em centavos

// Chave publicável do Stripe (substitua pela sua chave real)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PZA5sRxPlS21Bf7524k9j4jLz1g2v3h4k5j6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1A2B3C4D5E6F7G8H9I0J';

// Instância do Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Função para criar uma sessão de checkout no Stripe
export const createStripeCheckoutSession = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // O ID do produto deve ser criado no seu dashboard do Stripe
    const priceId = 'price_1PZABzRxPlS21Bf72lqfWjGf'; // Substitua pelo seu ID de preço real

    // Cria um documento no Firestore para a sessão de checkout
    const checkoutSessionRef = doc(db, 'users', auth.currentUser.uid, 'checkout_sessions', 'session');
    await setDoc(checkoutSessionRef, {
      price: priceId,
      success_url: `${window.location.origin}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/profile`,
      mode: 'payment',
      allow_promotion_codes: true,
    });

    // Redireciona para o checkout do Stripe
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: 'session' // Este não é o ID da sessão, mas um placeholder. O Firebase Extension cuida disso.
    });

    if (error) {
      console.error('Erro ao redirecionar para o checkout do Stripe:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao criar sessão de checkout do Stripe:', error);
    throw error;
  }
};

// Função para processar o pagamento após aprovação (via webhook do Stripe)
// Esta função é mais para o lado do cliente, para confirmar o status
export const processStripePayment = async (sessionId) => {
  try {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado');
    }

    const userId = auth.currentUser.uid;
    const sessionRef = doc(db, 'users', userId, 'checkout_sessions', sessionId);
    const sessionDoc = await getDoc(sessionRef);

    if (sessionDoc.exists() && sessionDoc.data().payment_status === 'paid') {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isPremium: true,
        premiumSince: new Date().toISOString(),
        lastPaymentId: sessionId,
        paymentPending: false,
      });
      return { success: true, userData: (await getDoc(userRef)).data() };
    } else {
      return { success: false, error: 'Pagamento não confirmado.' };
    }
  } catch (error) {
    console.error('Erro ao processar pagamento do Stripe:', error);
    return { success: false, error: error.message };
  }
};

// Função para verificar se o usuário é premium
export const checkPremiumStatus = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().isPremium || false : false;
  } catch (error) {
    console.error('Erro ao verificar status premium:', error);
    return false;
  }
};
