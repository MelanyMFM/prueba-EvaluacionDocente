import React from 'react';
import '../styles/PeriodSelector.css';

function PeriodSelector({ periods, selectedPeriod, onSelectPeriod, label = "Seleccione un periodo académico:" }) {
  return (
    <div className="period-selector">
      <label>{label}</label>
      <select 
        value={selectedPeriod || ''} 
        onChange={(e) => onSelectPeriod(e.target.value)}
        className="period-select"
      >
        <option value="" disabled>Seleccione un periodo</option>
        {periods.map(period => (
          <option key={period.id} value={period.id}>
            {period.id}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PeriodSelector;