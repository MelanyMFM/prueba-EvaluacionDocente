import usersData from '../data/users.json';

// Dominio de correo institucional
const INSTITUTIONAL_DOMAIN = 'unal.edu.co';

// Función para obtener los roles de un usuario
export const getUserRoles = (email) => {
  if (!email) return null;
  
  const domain = email.split('@')[1];
  if (domain !== INSTITUTIONAL_DOMAIN) return null;

  const user = usersData.users.find(u => u.email === email);
  return user ? user.roles : null;
};

// Función para obtener el nombre del usuario
export const getUserName = (email) => {
  const user = usersData.users.find(u => u.email === email);
  return user ? user.name : null;
};

// Función para verificar si un usuario tiene acceso a una ruta específica
export const hasAccess = (userRoles, path) => {
  if (!userRoles || userRoles.length === 0) return false;

  const roleAccess = {
    estudiante: ['/estudiante'],
    profesor: ['/docente'],
    admin: ['/admin', '/estudiante', '/docente']
  };

  // Si el usuario es admin, tiene acceso a todo
  if (userRoles.includes('admin')) return true;

  // Verificar acceso basado en los roles del usuario
  return userRoles.some(role => roleAccess[role]?.includes(path));
};

// Función para obtener la ruta inicial basada en los roles
export const getInitialRoute = (userRoles) => {
  if (!userRoles || userRoles.length === 0) return '/';

  // Prioridad de roles para la ruta inicial
  if (userRoles.includes('admin')) return '/admin';
  if (userRoles.includes('profesor')) return '/docente';
  if (userRoles.includes('estudiante')) return '/estudiante';

  return '/';
}; 