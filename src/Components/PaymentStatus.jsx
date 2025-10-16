import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { processPayment } from '../services/mercadoPago';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // Obtém o status da URL através do pathname atual
    let paymentStatus = null;
    
    if (location.pathname.includes('payment-success')) {
      paymentStatus = 'approved';
    } else if (location.pathname.includes('payment-failure')) {
      paymentStatus = 'failure';
    } else if (location.pathname.includes('payment-pending')) {
      paymentStatus = 'pending';
    }
    
    // Tenta obter da query parameter também (para compatibilidade)
    const statusFromQuery = searchParams.get('status');
    if (statusFromQuery) {
      paymentStatus = statusFromQuery;
    }
    
    const paymentIdParam = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference');
    
    setPaymentId(paymentIdParam);

    // Verifica se o usuário está autenticado
    if (!auth.currentUser) {
      setStatus('error');
      setMessage('Você precisa estar logado para ver o status do pagamento.');
      return;
    }

    // Processa o pagamento se ele foi aprovado
    if (paymentStatus === 'approved' && paymentIdParam) {
      setStatus('processing');
      setMessage('Processando seu pagamento... Isso pode levar alguns segundos.');
      
      processPayment(paymentIdParam)
        .then((result) => {
          if (result.success) {
            setStatus('success');
            setMessage('Pagamento aprovado com sucesso! Você já é um usuário Premium.');
            // Força uma atualização da página após 2 segundos para garantir que o status seja atualizado
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setStatus('error');
            setMessage(`Houve um problema ao processar seu pagamento: ${result.error || 'Entre em contato com o suporte.'}`);
          }
        })
        .catch((error) => {
          console.error('Erro ao processar pagamento:', error);
          setStatus('error');
          setMessage(`Ocorreu um erro ao processar seu pagamento: ${error.message || 'Tente novamente mais tarde.'}`);
        });
    } else if (paymentStatus === 'pending') {
      setStatus('pending');
      setMessage('Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail quando for aprovado.');
    } else if (paymentStatus === 'failure') {
      setStatus('failure');
      setMessage('Seu pagamento foi recusado. Verifique seus dados e tente novamente.');
    } else if (paymentStatus === null) {
      setStatus('error');
      setMessage('Status do pagamento não encontrado.');
    }
  }, [searchParams, location.pathname]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleTryAgain = () => {
    navigate('/profile');
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        {status === 'loading' && (
          <div className="status-loading">
            <div className="spinner"></div>
            <h2>Carregando...</h2>
            <p>Verificando status do pagamento</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="status-processing">
            <div className="spinner"></div>
            <h2>Processando Pagamento</h2>
            <p>{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="status-success">
            <div className="status-icon success-icon">✓</div>
            <h2>Pagamento Aprovado!</h2>
            <p>{message}</p>
            <button onClick={handleGoToProfile} className="status-button">
              Ir para o Perfil
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="status-pending">
            <div className="status-icon pending-icon">⏱</div>
            <h2>Pagamento Pendente</h2>
            <p>{message}</p>
            <button onClick={handleGoToProfile} className="status-button">
              Ir para o Perfil
            </button>
          </div>
        )}

        {status === 'failure' && (
          <div className="status-failure">
            <div className="status-icon failure-icon">✗</div>
            <h2>Pagamento Falhou</h2>
            <p>{message}</p>
            <button onClick={handleTryAgain} className="status-button">
              Tentar Novamente
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="status-error">
            <div className="status-icon error-icon">!</div>
            <h2>Erro</h2>
            <p>{message}</p>
            <button onClick={handleGoToProfile} className="status-button">
              Voltar ao Perfil
            </button>
          </div>
        )}

        {paymentId && (
          <div className="payment-details">
            <p>ID do Pagamento: <span className="payment-id">{paymentId}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;