import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { getUserRoles, getUserName } from '../utils/roles';

const AuthContext = createContext({
  currentUser: null,
  userRoles: null,
  userName: null,
  signInWithGoogle: async () => {},
  logout: async () => {},
  loading: true
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const roles = getUserRoles(result.user.email);
      
      if (!roles || roles.length === 0) {
        await signOut(auth);
        throw new Error('Correo electrónico no autorizado');
      }
      
      return result.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  // Sign out
  async function logout() {
    try {
      await signOut(auth);
      setUserRoles(null);
      setUserName(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const roles = getUserRoles(user.email);
        const name = getUserName(user.email);
        setUserRoles(roles);
        setUserName(name);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRoles(null);
        setUserName(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRoles,
    userName,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 