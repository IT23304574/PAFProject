import { GoogleLogin } from '@react-oauth/google';
import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Register from './Register';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // ✅ Google Login Success
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const userData = await response.json();

      // ✅ SAVE TOKEN (IMPORTANT)
      localStorage.setItem("token", userData.token);

      login(userData);
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      setError(`Error: ${err.message}`);
    }
  };

  // ✅ Emergency login (for demo)
  const emergencyDevLogin = () => {
    const fakeUser = {
      name: 'Admin Presenter',
      email: 'admin@smartcampus.edu',
      picture: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      role: 'ADMIN'
    };

    login(fakeUser);
    navigate('/');
  };

  // ✅ UI
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#1e293b',
      borderRadius: '10px'
    }}>

      {showRegister ? (
        <>
          <h2>Create Account</h2>
          <Register />

          <br />

          <button
            onClick={() => setShowRegister(false)}
            style={{
              padding: '8px',
              background: '#64748b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              width: '100%'
            }}
          >
            Back to Login
          </button>
        </>
      ) : (
        <>
          <h2>Login Page</h2>
          <p>Welcome to Smart Campus. Please log in.</p>

          {error && (
            <p style={{ color: '#ef4444', marginBottom: '10px' }}>
              {error}
            </p>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
            marginTop: '20px'
          }}>

            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google Login Failed')}
            />

            <hr style={{ width: '100%', borderColor: '#475569' }} />

            <button
              onClick={emergencyDevLogin}
              style={{
                padding: '10px',
                background: '#3b82f6',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Emergency Dev Login
            </button>

            <button
              onClick={() => setShowRegister(true)}
              style={{
                padding: '10px',
                background: '#22c55e',
                border: 'none',
                color: 'white',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Create Account
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Login;