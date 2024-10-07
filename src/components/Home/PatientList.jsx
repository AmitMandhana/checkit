import { useState} from "react";
import axios from "axios";
import './PatientList.css';

const PatientList = () => {
  const [age, setAge] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleDateChange = (e) => {
    setAppointmentDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://amit19-1.onrender.com/api/patients/age/${age}/appointment/${appointmentDate}`
      );
      const filteredPatients = response.data;
      setPatients(filteredPatients);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Error fetching data");
      setPatients([]);
    }
  };

  // Sort patients by serial number in ascending order
  const sortedPatients = [...patients].sort((a, b) => a.serialNumber - b.serialNumber);

  return (
    <div className="patient-list-container">
      <h2>Track Your Appoitment Time</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <label>
          Age:
          <input type="number" value={age} onChange={handleAgeChange} required />
        </label>
        <label>
          Appointment Date:
          <input type="date" value={appointmentDate} onChange={handleDateChange} required />
        </label>
        <button type="submit">Search</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {sortedPatients.length > 0 && (
        <ul className="patient-list">
          {sortedPatients.map((patient) => (
            <li key={patient._id}>
              <span className="serial-number">Serial Number: {patient.serialNumber}</span> - 
              <span className="name"> Name: {patient.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PatientList;
