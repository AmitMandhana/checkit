import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './profile.css'; // Optional: for styling
import img from './images/amits-baby.jpeg';
import { BmiGraph } from './bmi'; // Assuming BmiGraph is correctly imported
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation

const PatientProfile = ({ initialData }) => {
  const [showBmiGraph, setShowBmiGraph] = useState(false);
  const [appointmentData, setAppointmentData] = useState(initialData);
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  const handleBmiClick = () => {
    setShowBmiGraph(!showBmiGraph);
  };

  const fetchLatestAppointment = async () => {
    try {
      const response = await fetch('https://amit19-1.onrender.com/api/patients/latest');
      if (response.ok) {
        const data = await response.json();
        setAppointmentData(data);
        localStorage.setItem('appointmentData', JSON.stringify(data)); // Store data in localStorage
      } else {
        console.error('Failed to fetch latest appointment data, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching latest appointment data:', error);
    }
  };

  const fetchPrescriptions = async () => {
    const patientName = localStorage.getItem('patientName');
    try {
      const response = await fetch(`https://amit19-1.onrender.com/api/prescription/name/${patientName}`);
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      } else {
        console.error('Failed to fetch prescriptions, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  useEffect(() => {
    fetchLatestAppointment();
    fetchPrescriptions();
    const interval = setInterval(() => {
      fetchLatestAppointment();
      fetchPrescriptions();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const {
    name,
    fathersName,
    mothersName,
    age,
    gender,
    appointmentNumber,
    createdAt,
    weight,
    bmi,
    pulse,
    height,
    respiratoryRate,
    oxygenSaturation,
    image,
  } = appointmentData;

  const handleViewPrescription = (prescriptionDate) => {
    localStorage.setItem('prescriptionDate', prescriptionDate);
    navigate(`/prescription`);
  };

  return (
    <div>
      <h1 className='doctorh1'>Your Treatment Information</h1>
      <div className="patient-profile">
        <div className="left-side-patient">
          <div className="patient-info">
            <h1 id="p" className='hd'>Patient profile</h1>
            <img src={image || img} alt={`${name}'s profile`} className="patient-image" />
            <h3 id="q">{localStorage.getItem('patientName')}</h3>{/*changed localStorage.getItem('patientName') from name*/}
            <p><span>Father's Name: </span>{fathersName}</p>
            <p><span>Mother's Name: </span> {mothersName}</p>
            <p><span>Age:</span> {age}</p>
            <p><span>Sex: </span>{gender}</p>
            <p><span>Appointment ID:</span> {appointmentNumber}</p>
            <p><span>Last Appointment Date: </span> {new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="right-side-patient">
          <h2 id="r" className='hd'>Additional Information</h2>
          <div className="card-container-profile">
            <div className="card">
              <div className="metric">Weight</div>
              <div>{weight} kg</div>
            </div>
            <div className="card">
              <div onClick={handleBmiClick} className="clickable metric">BMI</div>
              <div>{bmi} kg/m<sup>2</sup></div>
            </div>
            <div className="card">
              <div className="metric">Pulse</div>
              <div>{pulse} bpm</div>
            </div>
            <div className="card">
              <div className="metric">Height</div>
              <div>{height} cm</div>
            </div>
            <div className="card">
              <div className="metric">Respiratory Rate</div>
              <div>{respiratoryRate} breaths/min</div>
            </div>
            <div className="card">
              <div className="metric">Oxygen Rate</div>
              <div>{oxygenSaturation} %</div>
            </div>
          </div>
          {showBmiGraph && <BmiGraph />}
          <a href="/Immunisation" className="view-profile-btn">Immunisation Analysis</a>
          <Link to="/appointments">
            <button id="btn" type="submit">View Your Prescription</button>
          </Link>
          {prescriptions.map((prescription, index) => (
            <div key={index} className="view-prescription-container">
              <div className="element date">{new Date(prescription.createdAt).toLocaleDateString()}</div>
              <div className="element name">Dr. Dipesh Barman</div>
              <button onClick={() => handleViewPrescription(prescription.createdAt)} className="element view">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

PatientProfile.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fathersName: PropTypes.string.isRequired,
    mothersName: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    gender: PropTypes.string.isRequired,
    appointmentNumber: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    weight: PropTypes.number,
    bmi: PropTypes.number,
    pulse: PropTypes.number,
    height: PropTypes.number,
    respiratoryRate: PropTypes.number,
    oxygenSaturation: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
};

PatientProfile.defaultProps = {
  initialData: {
    image: img,
  },
};

export default PatientProfile;
