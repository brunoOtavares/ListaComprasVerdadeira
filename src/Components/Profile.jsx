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
            setUserProfile({ ...docSnap.data(), email: user.email });
          } else {
            setError('No user data found in Firestore.');
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
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Email:</strong> {userProfile.email}</p>
        <p><strong>Age:</strong> {userProfile.age}</p>
      </div>
    </div>
  );
};

export default Profile;