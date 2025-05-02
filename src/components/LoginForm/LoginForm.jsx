import "./loginForm.css";

function LoginForm({ studentId, setStudentId, onAuthenticate }) {
  return (
    <div className="auth-container">
      <h2>Ingrese su Documento de Identidad</h2>
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Documento"
      />
      <button onClick={onAuthenticate}>Ingresar</button>
    </div>
  );
}

export default LoginForm;