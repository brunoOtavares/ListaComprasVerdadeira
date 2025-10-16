import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FazendoCompras.css';

export default function FazendoCompras({ shoppingList, onFinalizePurchase }) {
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  const availableItems = shoppingList.filter(
    (item) => !cart.some((cartItem) => cartItem.text === item.text)
  );

  const handleAddItemToCart = () => {
    if (selectedItem) {
      const itemToAdd = shoppingList.find(item => item.text === selectedItem);
      if (itemToAdd) {
        const numQuantity = parseInt(quantity, 10) || 1;
        const numPrice = parseFloat(price) || 0;
        setCart([...cart, { ...itemToAdd, quantity: numQuantity, price: numPrice }]);
        setQuantity('');
        setPrice('');
        setSelectedItem('');
      }
    }
  };

  const handleFinalize = () => {
    const finalizeHandler = onFinalizePurchase;
    if (typeof finalizeHandler === 'function') {
      finalizeHandler(cart);
    } else {
      // fallback: append to localStorage purchaseHistory
      const saved = localStorage.getItem('purchaseHistory');
      const history = saved ? JSON.parse(saved) : [];
      const newPurchase = {
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((t, i) => t + i.quantity * i.price, 0),
      };
      localStorage.setItem('purchaseHistory', JSON.stringify([...history, newPurchase]));
    }
    setCart([]);
    navigate('/historico');
  };

  const calculateItemTotal = (item) => {
    return (item.quantity * item.price).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return cart.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
  };

  return (
    <div className="fazendo-compras-container">
      <h2>Fazendo Compras</h2>
      <div className="add-item-section">
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          disabled={availableItems.length === 0}
        >
          <option value="" disabled>
            Selecione um item
          </option>
          {availableItems.length > 0 ? (
            availableItems.map((item, index) => (
              <option key={index} value={item.text}>
                {item.text}
              </option>
            ))
          ) : (
            <option disabled>Adicione itens na lista primeiro</option>
          )}
        </select>
        <input
          type="number"
          className="quantity-input"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantidade"
        />
        <input
          type="number"
          className="price-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          placeholder="Valor"
        />
        <button onClick={handleAddItemToCart} disabled={!selectedItem}>
          Adicionar
        </button>
      </div>

      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <span className="item-name">{item.text}</span>
            <div className="item-details">
              <span>Qtd: {item.quantity}</span>
              <span>Valor: R$ {item.price.toFixed(2)}</span>
            </div>
            <span className="item-total">
              Subtotal: R$ {calculateItemTotal(item)}
            </span>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="finalize-section">
          <div className="grand-total">
            <h3>Total da Compra: R$ {calculateGrandTotal()}</h3>
          </div>
          <button className="finalize-button" onClick={handleFinalize}>
            Terminar Compra
          </button>
        </div>
      )}
    </div>
  );
}
