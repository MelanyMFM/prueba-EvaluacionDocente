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
      setError('Por favor, seleccione un archivo Excel.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await readExcelFile(file);
      
      // Verificar que el archivo tenga los campos requeridos
      console.log('Datos del archivo:', data);

      if (!validateExcelData(data)) {
        setError('El archivo Excel no tiene el formato correcto. Verifique que contenga todos los campos requeridos.');
        setLoading(false);
        return;
      }
      
      // Actualizar la programación académica
      const updateResult = updateAcademicSchedule(data);
      
      setResult({
        message: 'Programación académica actualizada con éxito',
        details: updateResult
      });
    } catch (err) {
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
          
          // Obtener los datos como JSON con encabezados originales
          const rawData = XLSX.utils.sheet_to_json(worksheet);
          
          if (rawData.length === 0) {
            reject(new Error('El archivo no contiene datos'));
            return;
          }
          
          console.log("Datos originales:", rawData[0]);
          
          // Procesar los datos para normalizar los nombres de las columnas
          const processedData = rawData.map(row => {
            const newRow = {};
            
            // Mapear las claves originales a las claves normalizadas
            Object.keys(row).forEach(key => {
              // Manejar la columna vacía que contiene PERIODO
              if (key === '') {
                newRow['PERIODO'] = row[key];
              }
              // Manejar las columnas __EMPTY_X
              else if (key.startsWith('__EMPTY')) {
                const value = row[key];
                
                // Asignar valores basados en el contenido o posición
                if (key === '__EMPTY') newRow['COD_SEDE'] = value;
                else if (key === '__EMPTY_1') newRow['SEDE'] = value;
                else if (key === '__EMPTY_2') newRow['DOCUMENTO'] = value;
                else if (key === '__EMPTY_3') newRow['NOMBRE_ESTUDIANTE'] = value;
                else if (key === '__EMPTY_4') newRow['EMAIL'] = value;
                else if (key === '__EMPTY_5') newRow['ID_ASIGNATURA'] = value;
                else if (key === '__EMPTY_6') newRow['ASIGNATURA'] = value;
                else if (key === '__EMPTY_7') newRow['ID_GRUPO_ACTIVIDAD'] = value;
                else if (key === '__EMPTY_8') newRow['DOC_DOCENTE_PPAL'] = value;
                else if (key === '__EMPTY_9') newRow['NOMBRE_DOCENTE_PRINCIPAL'] = value;
                else if (key === '__EMPTY_10') newRow['EMAIL_DOCENTE_PRINCIPAL'] = value;
              }
              else {
                // Mantener otras claves tal como están
                newRow[key] = row[key];
              }
            });
            
            return newRow;
          });
          
          console.log("Datos procesados:", processedData[0]);
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
    const firstRow = data[0];
    console.log("Primera fila para validación:", firstRow);
    
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