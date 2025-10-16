import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Profile.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
        window.location.href = data.init_point;
      } else {
        setError('Erro ao iniciar o pagamento: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao solicitar preferência de pagamento:', error);
      setError('Erro ao solicitar preferência de pagamento.');
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
          <button onClick={handleUpgradeToPremium} className="upgrade-button">
            Upgrade para Premium (R$ 10,00)
          </button>
        )}
      </div>
    </div>
  );

};

export default Profile;