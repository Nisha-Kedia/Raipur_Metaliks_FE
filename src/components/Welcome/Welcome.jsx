import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Buyer from '../Buyer/Buyer';
import './Welcome.css'

export default function Welcome() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    setUsername(user);
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <div className="welcome-header-content">
          <h1 className="welcome-title">Welcome, {username}!</h1>
          <button 
            className="logout-button" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="buyer-section">
        <Buyer />
      </div>
    </div>
  );
}