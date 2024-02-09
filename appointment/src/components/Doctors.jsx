import React, { useState, useEffect } from 'react';
import avatar00 from '../images/defaultIcon.png';
import avatar01 from '../assets/DoctorIcons/Icon01.png';
import avatar02 from '../assets/DoctorIcons/Icon02.png';
import avatar03 from '../assets/DoctorIcons/Icon03.png';
import avatar04 from '../assets/DoctorIcons/Icon04.png';
import avatar05 from '../assets/DoctorIcons/Icon05.png';
import avatar06 from '../assets/DoctorIcons/Icon06.png';
import avatar07 from '../assets/DoctorIcons/Icon07.png';
import avatar08 from '../assets/DoctorIcons/Icon08.png';
import avatar09 from '../assets/DoctorIcons/Icon09.png';
import avatar10 from '../assets/DoctorIcons/Icon10.png';
import avatar11 from '../assets/DoctorIcons/Icon11.png';
import avatar12 from '../assets/DoctorIcons/Icon12.png';
import avatar13 from '../assets/DoctorIcons/Icon13.png';
import avatar14 from '../assets/DoctorIcons/Icon14.png';
import { useParams } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const {username} = useParams();
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [schedules, setSchedules] = useState([
    {
      doctorUserId: '',
      clinicId: '',
      clinicName: '',
      clinicAddress: '',
      clinicNumber: '',
      scheduleDay: '',
      slots: '',
    }
  ]);
  

  const setDisplayedAvatars = (avatar) => {
    const avatarImports = {
    'avatar01': avatar01,
    'avatar02': avatar02,
    'avatar03': avatar03,
    'avatar04': avatar04,
    'avatar05': avatar05,
    'avatar06': avatar06,
    'avatar07': avatar07,
    'avatar08': avatar08,
    'avatar09': avatar09,
    'avatar10': avatar10,
    'avatar11': avatar11,
    'avatar12': avatar12,
    'avatar13': avatar13,
    'avatar14': avatar14,
  };

    // Set selectedAvatar using the corresponding import
    setSelectedAvatar(avatarImports[avatar] || avatar00);
  };


  useEffect(() => {
    // Set displayed avatars based on the doctor's avatar value
    setDisplayedAvatars(doctor.avatar);
  }, [doctor.avatar]);


  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('https://railway-backend-production-a8c8.up.railway.app/schedules');
        
        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const schedulesData = await response.json();
        const formattedSchedules = schedulesData.map((schedulesData) => ({
          doctorUserId: schedulesData.doctorUserId,
          clinicId: schedulesData.clinicId,
          clinicName: schedulesData.clinic.name ,
          clinicAddress: schedulesData.clinic.address,
          clinicNumber: schedulesData.clinic.officeNumber,
          scheduleDay: schedulesData.scheduleDay,
          slots: schedulesData.slots,
        }));

        setSchedules(formattedSchedules);

      } catch (error) {
        console.error('Error fetching schedules:', error.message);
      }
    };

    fetchSchedules();
  }, []);

  const [uniqueClinics, setUniqueClinics] = useState([]);

  useEffect(() => {
    const getDoctorClinics = () => {
      // Filter schedules based on the doctorId
      const doctorSchedules = schedules.filter((schedule) => schedule.doctorUserId === doctor.doctorId);

      // Extract unique clinic IDs
      const uniqueClinicIds = Array.from(new Set(doctorSchedules.map((schedule) => schedule.clinicId)));

      // Create an array of objects for each unique clinic ID
      const uniqueClinicInfo = uniqueClinicIds.map((clinicId) => {
        const clinicSchedules = doctorSchedules.filter((schedule) => schedule.clinicId === clinicId);
        const clinicName = clinicSchedules[0]?.clinicName || ''; // Get the clinic name from the first schedule
        const clinicAddress = clinicSchedules[0]?.clinicAddress || '';
        const clinicNumber = clinicSchedules[0]?.clinicNumber || '';
        const scheduleDays = Array.from(new Set(clinicSchedules.map((schedule) => schedule.scheduleDay)));

        return {
          clinicId,
          clinicName,
          clinicAddress,
          clinicNumber,
          scheduleDays,
        };
      });

      // Set the extracted information in the component state
      setUniqueClinics(uniqueClinicInfo);
    };

    getDoctorClinics();
  }, [doctor, schedules]); 

  const handleGoToAppointment = async () => {
    window.location.href = `/setappointment/${username}/${doctor.doctorId}`;
  };
  return (
    <div className="doctor-card" style={{height: "380px"}}>
      <div className="doctor-info" style={{height: "350px"}}>
        <div style={{ display: 'flex', alignItems: 'center', height: '110px' }}>
          {selectedAvatar && (
            <img
              src={selectedAvatar}
              alt="Selected Avatar"
              style={{ width: '90px', height: 'auto', borderRadius: '50%', marginRight: '10px' }}
            />
          )}
          <div>
            <h2 style={{ lineHeight: 1, marginBottom: '5px', marginTop: '5px'}}>{doctor.firstName}</h2>
            <h2 style={{ lineHeight: 1}}>{doctor.lastName}</h2>
          </div>
        </div>
          <p style={{ margin: 0 }}>Contact Number: {doctor.contactNumber}</p>
          <p style={{ margin: 0 }}>Specialization: {doctor.specialization}</p>
          <p style={{ margin: 0 }}>Credentials: {doctor.credentials}</p>
          <div className="doctor-card-clinic">
          <h4>Clinics</h4>
              {uniqueClinics.map((clinic) => (
              <ul key={clinic.clinicId} style={{ borderRadius: '8px', backgroundColor: '#BDEBFF', padding: '0px', marginBottom: '18px' }}>
                <p style={{ margin: 0, marginLeft: 10}}>Clinic: {clinic.clinicName}</p>
                <p style={{ margin: 0, marginLeft: 10}}>Address: {clinic.clinicAddress}</p>
                <p style={{ margin: 0, marginLeft: 10}}>Schedule Day/s: {clinic.scheduleDays.join(', ')}</p>
              </ul>
              
              ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          
    <button
      style={{ padding: 5, borderRadius: 0, width: '250px', alignItems: 'center' }}
      onClick={handleGoToAppointment}
    >
      Set Appointment
    </button>
  </div>
      </div>
  
    </div>
  );
};

export default DoctorCard;