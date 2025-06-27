import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import { collection, getDocs, updateDoc, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db2 } from '../../../firebaseApp2'; // Asegúrate de tener esta ruta correcta
import './preguntasTab.css';

function PreguntasTab() {
  const { factoresDisponibles, tiposRespuestaDisponibles, preguntas, cargarPreguntas } = useContext(AppContext);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editText, setEditText] = useState('');
  const [editFactor, setEditFactor] = useState(1);
  const [editTipoRespuesta, setEditTipoRespuesta] = useState(tiposRespuestaDisponibles.BINARIA);
  const [newQuestion, setNewQuestion] = useState('');
  const [newFactor, setNewFactor] = useState(1);
  const [newTipoRespuesta, setNewTipoRespuesta] = useState(tiposRespuestaDisponibles.BINARIA);

  const [localPreguntas, setLocalPreguntas] = useState([]);

  useEffect(() => {
    setLocalPreguntas(preguntas || []);
  }, [preguntas]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    await addDoc(collection(db2, 'questions'), {
      texto: newQuestion,
      factor: newFactor,
      tipoRespuesta: newTipoRespuesta
    });

    setNewQuestion('');
    setNewFactor(1);
    setNewTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
    cargarPreguntas();
  };

  const handleRemoveQuestion = async (id) => {
    await deleteDoc(doc(db2, 'questions', id));
    cargarPreguntas();
  };

  const startEditing = (index) => {
    const q = localPreguntas[index];
    setEditingIndex(index);
    setEditText(q.texto);
    setEditFactor(q.factor);
    setEditTipoRespuesta(q.tipoRespuesta);
  };

  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditText('');
    setEditFactor(1);
    setEditTipoRespuesta(tiposRespuestaDisponibles.BINARIA);
  };

  const saveEdit = async () => {
    const q = localPreguntas[editingIndex];
  
    const idStr = String(q.id); // convertir a string
  
    console.log('ID de la pregunta a editar (string):', idStr, typeof idStr);
  
    const ref = doc(db2, 'questions', idStr);
  
    await updateDoc(ref, {
      texto: editText,
      factor: editFactor,
      tipoRespuesta: editTipoRespuesta
    });
  
    cancelEditing();
    cargarPreguntas();
  };
  
  

  return (
    <div className="preguntas-tab">
      <h2>Preguntas de la Encuesta</h2>
      <div className="questions-list">
        {localPreguntas.map((q, index) => (
          <div key={q.id} className="question-item">
            {editingIndex === index ? (
              <div className="question-edit">
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <select value={editFactor} onChange={(e) => setEditFactor(parseInt(e.target.value))}>
                  {factoresDisponibles.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                </select>
                <select value={editTipoRespuesta} onChange={(e) => setEditTipoRespuesta(e.target.value)}>
                  <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
                  <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
                  <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
                  <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
                </select>
                <button onClick={saveEdit}>Guardar</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </div>
            ) : (
              <>
                <span>{index + 1}. {q.texto}</span>
                <div className="question-metadata">
                  <span>Factor: {factoresDisponibles.find(f => f.id === q.factor)?.nombre}</span>
                  <span>Tipo: {q.tipoRespuesta}</span>
                </div>
                <div className="question-actions">
                  <button onClick={() => startEditing(index)}>Editar</button>
                  <button onClick={() => handleRemoveQuestion(q.id)}>Eliminar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-question">
        <h3>Agregar Nueva Pregunta</h3>
        <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Texto de la pregunta" />
        <select value={newFactor} onChange={(e) => setNewFactor(parseInt(e.target.value))}>
          {factoresDisponibles.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
        <select value={newTipoRespuesta} onChange={(e) => setNewTipoRespuesta(e.target.value)}>
          <option value={tiposRespuestaDisponibles.BINARIA}>Sí/No</option>
          <option value={tiposRespuestaDisponibles.FRECUENCIA}>Frecuencia</option>
          <option value={tiposRespuestaDisponibles.FRECUENCIA_NA}>Frecuencia con N/A</option>
          <option value={tiposRespuestaDisponibles.VALORACION}>Valoración</option>
        </select>
        <button onClick={handleAddQuestion}>Agregar</button>
      </div>
    </div>
  );
}

export default PreguntasTab;
