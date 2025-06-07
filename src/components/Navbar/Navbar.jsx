import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, userRoles, userName, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Si está cargando, mostrar una versión simplificada de la barra de navegación
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          Evaluación Docente
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      estudiante: 'Estudiante',
      profesor: 'Profesor',
      admin: 'Administrador'
    };
    return labels[role] || role;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Evaluación Docente
      </div>
      {currentUser && (
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-email">{currentUser.email}</span>
            <div className="user-roles">
              {userRoles?.map(role => (
                <span key={role} className="role-badge">
                  {getRoleLabel(role)}
                </span>
              ))}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 