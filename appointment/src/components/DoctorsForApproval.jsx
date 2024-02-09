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

const DoctorForApproval = ({ doctor, onReview }) => {
  const [avatar] = useState(doctor.profilePicture || '');
  const [selectedAvatar, setSelectedAvatar] = useState('');
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
    setSelectedAvatar(avatarImports[avatar] || avatar00);
  };


  useEffect(() => {
    setDisplayedAvatars(avatar);
  }, [avatar]);

  return (
    <div className="doctor-card" style={{height: "250px", width: "380px"}}>
      <div className="doctor-info" >
        <div style={{height: "200px", marginLeft:"10px", paddingTop: "6%" ,width: "300px"}}>
          {selectedAvatar && (
            <img
              src={selectedAvatar}
              alt="Selected Avatar"
              style={{float:"left", marginRight:"5%", width:"110px"}}
            />
          )}
          <div style={{marginLeft: "40%", width: "200px"}}>
            <h2 style={{lineHeight: 1, marginBottom: "10px"}}>{doctor.firstName}</h2>
            <h2 style={{lineHeight: 0.5, marginBottom: "10px"}}>{doctor.lastName}</h2>
            <div style={{textAlign: "left", overflowY: 'auto', maxHeight: '120px'}}>
              <p style={{margin: 0}}><b>Contact Number: </b>{doctor.contactNumber}</p>
              <p style={{margin: 0}}><b>Specialization: </b>{doctor.specialization}</p>
              <p style={{margin: 0}}><b>Credentials: </b> {doctor.credentials}</p>
            </div>
          </div>
        </div>
        <div>
          <button style={{padding: 5, borderRadius: 0, width: "340px", alignItems: "center", marginLeft: "2%"}} onClick={() => onReview(doctor.doctorId)}>Review Details</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorForApproval;