// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Login.css';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Reset error state
//     setError('');
    
//     // Basic validation
//     if (!username || !password) {
//       setError('Username and password are required');
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       const response = await fetch('http://raipurmetaliksbe-production.up.railway.app:8080/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: username,
//           password: password
//         })
//       });
      
//       const data = await response.text();
      
//       if (data === "User Login Succesfull") {
//         setLoginSuccess(true);
        
//         // Store user info in localStorage or sessionStorage if needed
//         localStorage.setItem('user', username);
        
//         // Show success message before redirecting
//         setTimeout(() => {
//           navigate('/welcome');
//         }, 1500);
//       } else {
//         setError(data || 'Login failed. Please check your credentials.');
//       }
//     } catch (err) {
//       setError('Server error. Please try again later.');
//       console.error('Login error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h1 className="login-title">IIIT BHubaneswar</h1>
        
//         {loginSuccess ? (
//           <div className="success-message">
//             Login successful!
//           </div>
//         ) : null}
        
//         {error ? (
//           <div className="error-message">
//             {error}
//           </div>
//         ) : null}
        
//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="form-group">
//             <label htmlFor="username" className="form-label">
//               username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="form-input"
//               placeholder="Enter your username"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password" className="form-label">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-input"
//               placeholder="Enter your password"
//             />
//           </div>
          
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="login-button"
//           >
//             {isSubmitting ? 'Signing in...' : 'Sign in'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    setError('');
    

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    if (username !== 'admin' || password !== 'password123') {
      setError('Invalid username or password');
      setIsSubmitting(false);
      return;
    }
    
    try {
      setIsSubmitting(true);
      

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoginSuccess(true);
      

      localStorage.setItem('user', username);
      

      setTimeout(() => {
        navigate('/welcome');
      }, 1500);
      
    } catch (err) {
      setError('Login failed. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">IIIT BHubaneswar</h1>
        
        {loginSuccess ? (
          <div className="success-message">
            Login successful!
          </div>
        ) : null}
        
        {error ? (
          <div className="error-message">
            {error}
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
} 
