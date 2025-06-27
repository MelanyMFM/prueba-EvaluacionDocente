import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import * as XLSX from 'xlsx';
import './ExcelUploader.css';

function ExcelUploader() {
  const { updateAcademicSchedule } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, seleccione un archivo Excel');
      return;
    }
  
    setLoading(true);
    setError(null);
    setResult(null);
  
    try {
      let data = await readExcelFile(file);
      if (!validateExcelData(data)) {
        setError('El archivo Excel no tiene el formato correcto');
        setLoading(false);
        return;
      }
  
      // Quitar cabecera si es necesario
      data.shift();
  
      // Importamos Firestore y db
      const { collection, doc, setDoc, getDoc } = await import('firebase/firestore');
      const { db2 } = await import('../../firebaseApp2');
  
      // Sets para evitar duplicados
      const newStudents = new Map();
      const newTeachers = new Map();
      const newCourses = new Map();
  
      const academicEnrollments = []; // Para studentCourses
  
      for (const row of data) {
        const periodo = row['PERIODO']?.toString().trim();
        const studentId = row['DOCUMENTO']?.toString().trim();
        const teacherId = row['DOC_DOCENTE_PPAL']?.toString().trim();
        const courseId = row['ID_ASIGNATURA']?.toString().trim();
        const sede = row['SEDE']?.toString().trim();
  
        // Validaciones básicas
        if (!periodo || !studentId || !teacherId || !courseId) continue;
  
        // Verificar estudiantes
        if (!newStudents.has(studentId)) {
          const studentRef = doc(db2, 'students', studentId);
          const studentSnap = await getDoc(studentRef);
          if (!studentSnap.exists()) {
            newStudents.set(studentId, {
              id: studentId,
              nombre: row['NOMBRE_ESTUDIANTE']?.toString().trim() || '',
              email: row['EMAIL']?.toString().trim() || ''
            });
          }
        }
  
        // Verificar docentes
        if (!newTeachers.has(teacherId)) {
          const teacherRef = doc(db2, 'teachers', teacherId);
          const teacherSnap = await getDoc(teacherRef);
          if (!teacherSnap.exists()) {
            newTeachers.set(teacherId, {
              id: teacherId,
              nombre: row['NOMBRE_DOCENTE_PRINCIPAL']?.toString().trim() || '',
              email: row['EMAIL_DOCENTE_PRINCIPAL']?.toString().trim() || ''
            });
          }
        }
  
        // Verificar asignaturas
        if (!newCourses.has(courseId)) {
          const courseRef = doc(db2, 'courses', courseId);
          const courseSnap = await getDoc(courseRef);
          if (!courseSnap.exists()) {
            newCourses.set(courseId, {
              id: courseId,
              nombre: row['ASIGNATURA']?.toString().trim() || '',
              sede: sede || 'Caribe'
            });
          }
        }
  
        // Agregar a studentCourses
        academicEnrollments.push({
          studentId,
          teacherId,
          courseId,
          period: periodo
        });
      }
  
      // Guardar en Firebase
      const savePromises = [];
      for (const [id, student] of newStudents) {
        savePromises.push(setDoc(doc(db2, 'students', id), student));
      }
      for (const [id, teacher] of newTeachers) {
        savePromises.push(setDoc(doc(db2, 'teachers', id), teacher));
      }
      for (const [id, course] of newCourses) {
        savePromises.push(setDoc(doc(db2, 'courses', id), course));
      }
      for (const enrollment of academicEnrollments) {
        const id = `${enrollment.studentId}_${enrollment.teacherId}_${enrollment.courseId}_${enrollment.period}`;
        savePromises.push(setDoc(doc(db2, 'studentCourses', id), enrollment));
      }
  
      await Promise.all(savePromises);
  
      setResult({
        message: 'Programación académica actualizada con éxito',
        details: {
          studentsCount: newStudents.size,
          teachersCount: newTeachers.size,
          coursesCount: newCourses.size
        }
      });
    } catch (err) {
      console.error(err);
      setError(`Error al procesar el archivo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // keep empty cells
  
          if (rawData.length === 0) {
            reject(new Error('El archivo no contiene datos'));
            return;
          }
  
          const firstRow = rawData[0];
          const firstKeys = Object.keys(firstRow);
  
          // mapeo manual
          const processedData = rawData.map(row => {
            //console.log("First column value:", firstKeys[0], row[firstKeys[0]]);
            const newRow = {};
  
            Object.keys(row).forEach(key => {
              const value = row[key];
  
              if (key === firstKeys[0]) newRow['PERIODO'] = value;
              else if (key === firstKeys[1]) newRow['COD_SEDE'] = value;
              else if (key === firstKeys[2]) newRow['SEDE'] = value;
              else if (key === firstKeys[3]) newRow['DOCUMENTO'] = value;
              else if (key === firstKeys[4]) newRow['NOMBRE_ESTUDIANTE'] = value;
              else if (key === firstKeys[5]) newRow['EMAIL'] = value;
              else if (key === firstKeys[6]) newRow['ID_ASIGNATURA'] = value;
              else if (key === firstKeys[7]) newRow['ASIGNATURA'] = value;
              else if (key === firstKeys[8]) newRow['ID_GRUPO_ACTIVIDAD'] = value;
              else if (key === firstKeys[9]) newRow['DOC_DOCENTE_PPAL'] = value;
              else if (key === firstKeys[10]) newRow['NOMBRE_DOCENTE_PRINCIPAL'] = value;
              else if (key === firstKeys[11]) newRow['EMAIL_DOCENTE_PRINCIPAL'] = value;
              else newRow[key] = value;
            });
            
            return newRow;
          });
          resolve(processedData);
  
        } catch (error) {
          console.error("Error al procesar el archivo:", error);
          reject(error);
        }
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  };
  

  const validateExcelData = (data) => {
    if (!data || data.length === 0) {
      console.log("No hay datos para validar");
      return false;
    }
    
    // Verificar que al menos tenga los campos esenciales
    const requiredFields = [
      'PERIODO', 'DOCUMENTO', 'NOMBRE_ESTUDIANTE',
      'EMAIL', 'ID_ASIGNATURA', 'ASIGNATURA',
      'DOC_DOCENTE_PPAL', 'NOMBRE_DOCENTE_PRINCIPAL'
    ];
    
    // Obtener todas las claves del primer objeto
    const firstRow = data[1];
   // console.log("Primera fila para validación:", firstRow);
    
    // Verificar si todos los campos requeridos están presentes
    let missingFields = [];
    
    for (const field of requiredFields) {
      // Buscar el campo en el objeto, incluso con nombres parciales
      const found = Object.keys(firstRow).some(key => {
        const keyUpper = key.toUpperCase();
        const fieldUpper = field.toUpperCase();
        return keyUpper === fieldUpper || 
               keyUpper.includes(fieldUpper) || 
               fieldUpper.includes(keyUpper);
      });
      
      if (!found) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      console.log('Campos faltantes:', missingFields);
      return false;
    }
    
    return true;
  };

  return (
    <div className="excel-uploader">
      <h2>Cargar Programación Académica</h2>
      <p>
        Seleccione un archivo Excel con la programación académica
      </p>
      
      <div className="upload-container">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="file-input"
        />
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? 'Procesando...' : 'Cargar y Actualizar'}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {result && (
        <div className="success-message">
          <h3>{result.message}</h3>
          <div className="result-details">
            <p>Estudiantes: {result.details.studentsCount}</p>
            <p>Docentes: {result.details.teachersCount}</p>
            <p>Cursos: {result.details.coursesCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExcelUploader;