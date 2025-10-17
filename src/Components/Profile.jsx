import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Profile.css';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserProfile({ 
          ...docSnap.data(), 
          email: user.email, 
          createdAt: new Date(docSnap.data().createdAt).toLocaleDateString() 
        });
      } else {
        // If user data not found, use basic user info
        setUserProfile({ 
          email: user.email, 
          createdAt: new Date(user.metadata.creationTime).toLocaleDateString() 
        });
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
      </div>
    </div>
  );
};

export default Profile;