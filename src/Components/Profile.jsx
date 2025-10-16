import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [paymentTab, setPaymentTab] = useState(null);

  const fetchUserProfile = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile({ ...docSnap.data(), email: user.email, createdAt: new Date(docSnap.data().createdAt).toLocaleDateString() });
      } else {
        // If user data not found, assume free user
        setUserProfile({ email: user.email, isPremium: false, createdAt: new Date(user.metadata.creationTime).toLocaleDateString() });
      }
    } catch (e) {
      setError('Error fetching user data: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Verificar se o usuário está retornando da página de pagamento
  useEffect(() => {
    if (location.pathname === '/profile' && auth.currentUser && location.state?.fromPayment) {
      setLoading(true);
      fetchUserProfile(auth.currentUser);
    }
  }, [location, auth.currentUser]);

  const handleUpgradeToPremium = async () => {
    if (!auth.currentUser) {
      setError('Você precisa estar logado para fazer upgrade.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: auth.currentUser.uid }),
      });

      const data = await response.json();

      if (data.init_point) {
        // Usar init_point que funciona melhor com PIX no sandbox
        const newTab = window.open(data.init_point, '_blank');
        setPaymentTab(newTab);
        
        // Verificar periodicamente se o pagamento foi concluído
        const checkPaymentStatus = setInterval(async () => {
          try {
            const statusResponse = await fetch(`http://localhost:3000/check-payment-status/${auth.currentUser.uid}`);
            const statusData = await statusResponse.json();
            
            if (statusData.isPaid) {
              // Pagamento confirmado, fechar a aba e atualizar o perfil
              if (newTab && !newTab.closed) {
                newTab.close();
              }
              setPaymentTab(null);
              clearInterval(checkPaymentStatus);
              await fetchUserProfile(auth.currentUser);
            }
          } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
          }
        }, 5000); // Verificar a cada 5 segundos
        
        // Parar de verificar após 10 minutos (evitar verificações infinitas)
        setTimeout(() => {
          clearInterval(checkPaymentStatus);
          setPaymentTab(null);
        }, 600000);
      } else if (data.sandbox_init_point) {
        // Usar sandbox como alternativa
        const newTab = window.open(data.sandbox_init_point, '_blank');
        setPaymentTab(newTab);
        
        // Verificar periodicamente se o pagamento foi concluído
        const checkPaymentStatus = setInterval(async () => {
          try {
            const statusResponse = await fetch(`http://localhost:3000/check-payment-status/${auth.currentUser.uid}`);
            const statusData = await statusResponse.json();
            
            if (statusData.isPaid) {
              // Pagamento confirmado, fechar a aba e atualizar o perfil
              if (newTab && !newTab.closed) {
                newTab.close();
              }
              setPaymentTab(null);
              clearInterval(checkPaymentStatus);
              await fetchUserProfile(auth.currentUser);
            }
          } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
          }
        }, 5000); // Verificar a cada 5 segundos
        
        // Parar de verificar após 10 minutos
        setTimeout(() => {
          clearInterval(checkPaymentStatus);
          setPaymentTab(null);
        }, 600000);
      } else {
        setError('Erro ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao solicitar preferência de pagamento:', error);
      setError(`Erro ao solicitar preferência de pagamento: ${error.message || error.code || error}`);
    }
  };


  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-container error-message">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="profile-container">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        <p><strong>Name:</strong> {userProfile.name || 'N/A'}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Account Created:</strong> {userProfile.createdAt}</p>
        <p><strong>Status:</strong> {userProfile.isPremium ? 'Premium' : 'Gratuito'}</p>
        {!userProfile.isPremium && (
          <div className="payment-buttons">
            <button onClick={handleUpgradeToPremium} className="upgrade-button">
              Upgrade para Premium (R$ 11,00)
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default Profile;