import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import RoleSelector from "./components/RoleSelector/RoleSelector";
import EstudiantePage from "./pages/EstudiantePage/EstudiantePage";
import AdminPage from "./pages/AdminPage/AdminPage";
import DocentePage from "./pages/DocentePage/DocentePage";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <RoleSelector />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/estudiante"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <EstudiantePage />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <AdminPage />
                </>
              </PrivateRoute>
            }
          />
          <Route
            path="/docente"
            element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <DocentePage />
                </>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
