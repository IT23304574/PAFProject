import { GoogleLogin } from '@react-oauth/google';
import { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the Google JWT token to the Spring Boot backend
      const response = await fetch('http://127.0.0.1:8080/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }

      // Backend returns verified user details with database role
      const userData = await response.json();
      login(userData);
      navigate('/'); // Redirect after login
    } catch (err) {
      console.error('Login error:', err);
      setError(`Error: ${err.message}`);
    }
  };

  // FAIL-SAFE: Use this if Google or CORS blocks you during your presentation!
  const emergencyDevLogin = () => {
    login({
      name: 'Admin Presenter',
      email: 'admin@smartcampus.edu',
      picture: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      role: 'ADMIN' // Grants you access to all Admin UI features
    });
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', padding: '40px', backgroundColor: '#1e293b', borderRadius: '10px' }}>
      <h2>Login Page</h2>
      <p>Welcome to Smart Campus. Please log in.</p>
      {error && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Google Login Failed')}
        />
        <hr style={{ width: '100%', borderColor: '#475569', margin: '5px 0' }} />
        <button onClick={emergencyDevLogin} style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Emergency Dev Login (Bypass Google)
        </button>
      </div>
    </div>
  );
}

export default Login;