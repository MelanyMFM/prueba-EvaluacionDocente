import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const { signInWithGoogle, currentUser, userRoles } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && userRoles) {
      // Redirigir a la página de inicio en lugar de la página específica del rol
      navigate('/');
    }
  }, [currentUser, userRoles, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Intentar iniciar sesión con Google
      const result = await signInWithGoogle();
      
      // Verificar si el correo es de la UNAL
      if (!result.user.email.endsWith('@unal.edu.co')) {
        await signOut(auth);
        throw new Error('Solo se permiten correos institucionales de la UNAL');
      }

      // La redirección se manejará en el useEffect cuando currentUser y userRoles estén disponibles
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(
        error.message === 'Correo electrónico no autorizado'
          ? 'Tu correo electrónico no está autorizado para acceder a esta aplicación.'
          : error.message === 'Solo se permiten correos institucionales de la UNAL'
          ? 'Solo se permiten correos institucionales de la UNAL (@unal.edu.co)'
          : 'Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bienvenido</h1>
        <p>Inicia sesión con tu correo institucional UNAL</p>
        {error && <div className="error-message">{error}</div>}
        <button 
          className="google-signin-button"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google logo" 
            className="google-icon"
          />
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
        </button>
        <p className="login-info">
          Solo se permiten correos institucionales UNAL (@unal.edu.co)
          <br />
          El sistema verificará automáticamente tus roles asignados
        </p>
      </div>
    </div>
  );
};

export default Login; 