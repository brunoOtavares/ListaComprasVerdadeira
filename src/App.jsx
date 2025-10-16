

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from "./Components/Header";
import TodoList from "./Components/TodoList";
import FazendoCompras from "./Components/FazendoCompras";
import HistoricoCompras from "./Components/HistoricoCompras";
import Dashboard from "./Components/Dashboard";
import Login from './Components/Login';
import Profile from './Components/Profile';
import { auth, db } from './lib/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, getDoc, deleteDoc } from 'firebase/firestore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false); // New state for premium status
  const [dataLoaded, setDataLoaded] = useState(false);
  const [shoppingListLoaded, setShoppingListLoaded] = useState(false);
  const [purchaseHistoryLoaded, setPurchaseHistoryLoaded] = useState(false);
  const navigate = useNavigate();
  const [shoppingList, setShoppingList] = useState([]);

  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setUser(user);
      if (user) {
        // Fetch premium status from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setIsPremium(userDocSnap.data().isPremium || false);
        } else {
          setIsPremium(false);
        }
        if (shoppingListLoaded && purchaseHistoryLoaded) {
          setLoading(false);
        }
      } else {
        setIsPremium(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [shoppingListLoaded, purchaseHistoryLoaded]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);



  useEffect(() => {
    if (user) {
      const unsubscribeShoppingList = onSnapshot(collection(db, 'users', user.uid, 'shoppingList'), (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShoppingList(list);
        setShoppingListLoaded(true);
      });

      const unsubscribePurchaseHistory = onSnapshot(collection(db, 'users', user.uid, 'purchaseHistory'), (snapshot) => {
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPurchaseHistory(history);
        setPurchaseHistoryLoaded(true);
      });

      return () => {
        unsubscribeShoppingList();
        unsubscribePurchaseHistory();
      };
    }
  }, [user]);

  const handleFinalizePurchase = async (cart) => {
    if (user) {
      const newPurchase = {
        date: serverTimestamp(),
        items: cart,
        total: cart.reduce((total, item) => total + item.quantity * item.price, 0),
      };
      await addDoc(collection(db, 'users', user.uid, 'purchaseHistory'), newPurchase);

      // Clear the shopping list after purchase
      shoppingList.forEach(async (item) => {
        const itemRef = doc(db, 'users', user.uid, 'shoppingList', item.id);
        await deleteDoc(itemRef);
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      {user && <Header />}
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<TodoList shoppingList={shoppingList} setShoppingList={setShoppingList} auth={auth} db={db} />} 
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
            element={isPremium ? <Dashboard purchaseHistory={purchaseHistory} /> : <div className="premium-required"><h2>Acesso Premium Necessário</h2><p>Faça upgrade para Premium para acessar o Dashboard.</p></div>} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
