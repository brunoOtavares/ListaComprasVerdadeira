import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { createStripeCheckoutSession, processStripePayment } from '../services/stripe';
import './Profile.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      
      // Carrega os dados do usuário uma vez em vez de usar onSnapshot
      const loadUserData = async () => {
        try {
          const docSnapshot = await getDoc(userDocRef);
          
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserProfile(userData);
            setIsPremium(userData.isPremium || false);
            

          } else {
            // Cria o documento do usuário se não existir
            await setDoc(userDocRef, {
              email: auth.currentUser.email,
              createdAt: new Date().toISOString(),
              isPremium: false
            });
            
            setUserProfile({
              email: auth.currentUser.email,
              createdAt: new Date().toISOString(),
              isPremium: false
            });
            setIsPremium(false);
          }
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          // Define valores padrão mesmo com erro
          setUserProfile({
            email: auth.currentUser.email,
            createdAt: new Date().toISOString(),
            isPremium: false
          });
          setIsPremium(false);
        }
      };
      
      loadUserData();
    }
  }, []);

  // Função para recarregar os dados do perfil
  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const docSnapshot = await getDoc(userDocRef);
      
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserProfile(userData);
        setIsPremium(userData.isPremium || false);
        alert('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomePremium = async () => {
    if (!auth.currentUser) {
      alert('Você precisa estar logado para se tornar Premium.');
      return;
    }
    
    setLoading(true);
    try {
      await createStripeCheckoutSession();
    } catch (error) {
      console.error('Erro ao iniciar checkout:', error);
      alert('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };



  // Calcula idade do usuário (se tiver data de nascimento)
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Não informada';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="profile-container">
      <h2>Perfil do Usuário</h2>
      {userProfile ? (
        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="profile-basic-info">
              <p><strong>Email:</strong> {auth.currentUser.email}</p>
              <p><strong>Membro desde:</strong> {new Date(userProfile.createdAt || auth.currentUser.metadata.creationTime).toLocaleDateString('pt-BR')}</p>
              {userProfile.birthDate && (
                <p><strong>Idade:</strong> {calculateAge(userProfile.birthDate)} anos</p>
              )}
              <button
                onClick={refreshProfile}
                className="refresh-profile-button"
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Atualizar Perfil'}
              </button>
            </div>
          </div>
          
          <div className="subscription-status">
            <h3>Status da Assinatura</h3>
            {isPremium ? (
              <div className="premium-status-active">
                <div className="premium-badge">
                  <span className="premium-icon">⭐</span>
                  <span>Você é um usuário Premium!</span>
                </div>
                <p className="premium-info">
                  Aproveite o acesso completo ao dashboard e todas as funcionalidades avançadas.
                </p>
                {userProfile.premiumSince && (
                  <p className="premium-since">
                    Premium desde: {new Date(userProfile.premiumSince).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ) : (
              <div className="premium-status-inactive">
                <p>Você não é um usuário Premium.</p>
                <div className="premium-benefits">
                  <h4>Benefícios Premium:</h4>
                  <ul>
                    <li>Acesso completo ao dashboard</li>
                    <li>Estatísticas detalhadas de compras</li>
                    <li>Gráficos avançados</li>
                    <li>Sem anúncios</li>
                  </ul>
                </div>
                <div className="premium-actions">
                  <button
                    onClick={handleBecomePremium}
                    className="premium-button"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Torne-se Premium por R$ 10,00/mês'}
                  </button>
                  

                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Carregando perfil...</p>
      )}
    </div>
  );
};

export default Profile;
