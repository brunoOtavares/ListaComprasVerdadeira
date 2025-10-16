import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import './PaymentStatus.css';
import './PaymentStatus.css';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('removed');
  const [message, setMessage] = useState('A funcionalidade de pagamento foi removida.');
  const [paymentId, setPaymentId] = useState(null);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  const handleTryAgain = () => {
    navigate('/profile');
  };

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <h2>Funcionalidade de Pagamento Removida</h2>
        <p>{message}</p>
        <button onClick={handleGoToProfile} className="status-button">
          Voltar ao Perfil
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;