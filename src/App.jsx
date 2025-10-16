

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from "./Components/Header";
import TodoList from "./Components/TodoList";
import FazendoCompras from "./Components/FazendoCompras";
import HistoricoCompras from "./Components/HistoricoCompras";
import Dashboard from "./Components/Dashboard";
import './App.css';

function App() {
  const [shoppingList, setShoppingList] = useState(() => {
    const savedList = localStorage.getItem('shoppingList');
    return savedList ? JSON.parse(savedList) : [];
  });

  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const savedHistory = localStorage.getItem('purchaseHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  const handleFinalizePurchase = (cart) => {
    const newPurchase = {
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((total, item) => total + item.quantity * item.price, 0),
    };
    console.log("Finalizing purchase, new history will be:", [...purchaseHistory, newPurchase]);
    setPurchaseHistory([...purchaseHistory, newPurchase]);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<TodoList shoppingList={shoppingList} setShoppingList={setShoppingList} />} 
          />
          <Route 
            path="/fazendo-compras" 
            element={<FazendoCompras shoppingList={shoppingList} onFinalizePurchase={handleFinalizePurchase} />} 
          />
          <Route 
            path="/historico" 
            element={<HistoricoCompras purchaseHistory={purchaseHistory} />} 
          />
          <Route 
            path="/dashboard" 
            element={<Dashboard purchaseHistory={purchaseHistory} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
