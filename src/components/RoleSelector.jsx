import { useNavigate } from 'react-router-dom';

function RoleSelector(){
  const navigate = useNavigate();

  return (
    <div className="role-selector">
      <h1>Selecciona tu rol</h1>
      <button onClick={() => navigate('/estudiante')}>Estudiante</button>
      <button onClick={() => navigate('/admin')}>Administrador</button>
      <button onClick={() => navigate('/docente')}>Docente</button>
    </div>
  );
};

export default RoleSelector;
