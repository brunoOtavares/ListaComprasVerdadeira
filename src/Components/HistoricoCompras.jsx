import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoricoCompras.css';

export default function HistoricoCompras({ purchaseHistory }) {
  const navigate = useNavigate();
  const stored = React.useMemo(() => {
    if (purchaseHistory && purchaseHistory.length > 0) return purchaseHistory;
    try {
      const saved = localStorage.getItem('purchaseHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, [purchaseHistory]);
  return (
    <div className="historico-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Histórico de Compras</h2>
        <button onClick={() => navigate('/dashboard')} className="view-dashboard-button">Ver Dashboard</button>
      </div>
      {stored.length === 0 ? (
        <p>Nenhuma compra foi finalizada ainda.</p>
      ) : (
        stored.map((purchase, index) => (
          <div key={index} className="purchase-card">
            <div className="purchase-header">
              <h3>Compra #{index + 1}</h3>
              <span>{new Date(purchase.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <ul className="purchase-items">
              {purchase.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <span className="item-name">{item.text}</span>
                  <span className="item-details">
                    {item.quantity} x R$ {item.price.toFixed(2)}
                  </span>
                  <span className="item-subtotal">
                    R$ {(item.quantity * item.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="purchase-total">
              <strong>Total da Compra: R$ {purchase.total.toFixed(2)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
