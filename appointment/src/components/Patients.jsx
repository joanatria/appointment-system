import React, { useState, useEffect } from 'react';
import avatar00 from '../images/defaultIcon.png';
import patavatar01 from '../assets/PatientIcons/Avatar01.png';
import patavatar02 from '../assets/PatientIcons/Avatar02.png';
import patavatar03 from '../assets/PatientIcons/Avatar03.png';
import patavatar04 from '../assets/PatientIcons/Avatar04.png';
import patavatar05 from '../assets/PatientIcons/Avatar05.png';
import patavatar06 from '../assets/PatientIcons/Avatar06.png';
import patavatar07 from '../assets/PatientIcons/Avatar07.png';
import patavatar08 from '../assets/PatientIcons/Avatar08.png';
import patavatar09 from '../assets/PatientIcons/Avatar09.png';
import patavatar10 from '../assets/PatientIcons/Avatar10.png';
import patavatar11 from '../assets/PatientIcons/Avatar11.png';
import patavatar12 from '../assets/PatientIcons/Avatar12.png';
import patavatar13 from '../assets/PatientIcons/Avatar13.png';
import patavatar14 from '../assets/PatientIcons/Avatar14.png';
import patavatar15 from '../assets/PatientIcons/Avatar15.png';
import patavatar16 from '../assets/PatientIcons/Avatar16.png';
import patavatar17 from '../assets/PatientIcons/Avatar17.png';
import patavatar18 from '../assets/PatientIcons/Avatar18.png';

const PatientCards = ({ patient, onReview }) => {
  const [avatar] = useState(patient.profilePicture || '');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const setDisplayedAvatars = (avatar) => {
    const avatarImports = {
        'patavatar01': patavatar01,
        'patavatar02': patavatar02,
        'patavatar03': patavatar03,
        'patavatar04': patavatar04,
        'patavatar05': patavatar05,
        'patavatar06': patavatar06,
        'patavatar07': patavatar07,
        'patavatar08': patavatar08,
        'patavatar09': patavatar09,
        'patavatar10': patavatar10,
        'patavatar11': patavatar11,
        'patavatar12': patavatar12,
        'patavatar13': patavatar13,
        'patavatar14': patavatar14,
        'patavatar15': patavatar15,
        'patavatar16': patavatar16,
        'patavatar17': patavatar17,
        'patavatar18' : patavatar18
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
            <h2 style={{lineHeight: 1, marginBottom: "10px"}}>{patient.firstName}</h2>
            <h2 style={{lineHeight: 0.5, marginBottom: "10px"}}>{patient.lastName}</h2>
            <div style={{textAlign: "left", overflowY: 'auto', maxHeight: '120px'}}>
              <p style={{margin: 0}}><b>Contact Number: </b>{patient.contactNumber}</p>
              <p style={{margin: 0}}><b>Email: </b>{patient.email}</p>
            </div>
          </div>
        </div>
        <div>
          <button style={{padding: 5, borderRadius: 0, width: "340px", alignItems: "center", marginLeft: "2%"}} onClick={() => onReview(patient.patientId)}>Review Details</button>
        </div>
      </div>
    </div>
  );
};

export default PatientCards;