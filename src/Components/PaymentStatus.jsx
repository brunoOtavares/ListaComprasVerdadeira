import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processando status do pagamento...');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const userIdParam = searchParams.get('user_id');
    const paymentId = searchParams.get('payment_id');
    
    setUserId(userIdParam);
    
    if (statusParam === 'approved') {
      setStatus('success');
      setMessage('Pagamento aprovado com sucesso! Sua conta está sendo atualizada para Premium.');
      
      // Atualizar o status do usuário no Firebase
      if (userIdParam) {
        const updateUserStatus = async () => {
          try {
            const userRef = doc(db, 'users', userIdParam);
            await updateDoc(userRef, { isPremium: true });
            console.log('Usuário atualizado para Premium com sucesso');
            setMessage('Pagamento aprovado com sucesso! Sua conta foi atualizada para Premium.');
          } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            setMessage('Pagamento aprovado, mas houve um erro ao atualizar seu status. Por favor, contate o suporte.');
          }
        };
        updateUserStatus();
      }
    } else if (statusParam === 'failure') {
      setStatus('error');
      setMessage('O pagamento falhou. Por favor, tente novamente.');
    } else if (statusParam === 'pending') {
      setStatus('pending');
      setMessage('Seu pagamento está sendo processado. Você receberá uma confirmação em breve.');
    } else {
      setStatus('error');
      setMessage('Status do pagamento desconhecido.');
    }
  }, [searchParams]);

  const handleGoToProfile = () => {
    navigate('/profile', { state: { fromPayment: true } });
  };

  const handleTryAgain = () => {
    navigate('/profile', { state: { fromPayment: true } });
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <h2>
          {status === 'success' && 'Pagamento Aprovado!'}
          {status === 'error' && 'Pagamento Falhou'}
          {status === 'pending' && 'Pagamento Pendente'}
          {status === 'processing' && 'Processando...'}
        </h2>
        <p>{message}</p>
        <div className="status-buttons">
          <button onClick={handleGoToProfile} className="status-button primary">
            Ir para o Perfil
          </button>
          {status === 'error' && (
            <button onClick={handleTryAgain} className="status-button secondary">
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;