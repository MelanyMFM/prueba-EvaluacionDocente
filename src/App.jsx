import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelector from "./components/RoleSelector/RoleSelector";
import EstudiantePage from "./pages/EstudiantePage/EstudiantePage";
import AdminPage from "./pages/AdminPage";
import DocentePage from "./pages/DocentePage";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route path="/estudiante" element={<EstudiantePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/docente" element={<DocentePage />} />
      </Routes>
    </Router>
  );
};

export default App;
