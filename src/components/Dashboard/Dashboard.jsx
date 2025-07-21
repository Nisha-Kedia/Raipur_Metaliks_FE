import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  // Form state
  const [date, setDate] = useState('');
  const [metalType, setMetalType] = useState('');
  const [price, setPrice] = useState('');

  // Component state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  // On component mount, check if user is logged in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      // If no user is found in localStorage, redirect to login
      navigate('/login');
    } else {
      setUsername(loggedInUser);
      // Set default date to today for convenience
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Basic validation
    if (!date || !metalType || !price) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:8393/api/metalvsday', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          metalType: metalType,
          price: parseFloat(price) // Ensure price is sent as a number
        })
      });

      if (!response.ok) {
        // Handle server-side errors (e.g., validation failed)
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to add record.');
      }

      
      // If successful:
      const newRecord = await response.json();
      console.log('Successfully added:', newRecord);
      
      setSuccessMessage(`Record for ${metalType} added successfully!`);

      // Clear the form fields for the next entry
      setMetalType('');
      setPrice('');
      
      // Navigate to buyer page after 1.5 seconds
      setTimeout(() => {
        navigate('/buyer');
      }, 1500);
      
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Data Entry Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {username}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="form-card">
        <h2 className="form-title">Add New Metal Price</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="metalType" className="form-label">Metal Type</label>
            <input
              id="metalType"
              type="text"
              value={metalType}
              onChange={(e) => setMetalType(e.target.value)}
              className="form-input"
              placeholder="e.g., Iron, Steel, Copper"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              id="price"
              type="number"
              step="0.01" // Allows decimal values
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
              placeholder="e.g., 45000.50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Adding Record...' : 'Add Record'}
          </button>
        </form>
      </div>
    </div>
  );
}