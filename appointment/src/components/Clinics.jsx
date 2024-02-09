import React, { useState } from 'react';
import Popup from './Popup'
const ClinicCard = ({ clinic, onEdit }) => {

  const [isDeleteAccountVisible, setIsDeleteAccountVisible] = useState(false);

  const handleDeletePopup = () => {
    setIsDeleteAccountVisible(true);
  };
  const closeDeletePopup = () => {
    setIsDeleteAccountVisible(false);
  };

  const handleDeleteClinic = async () => {
    try {
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/clinic/${clinic.clinicId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers if needed
        },
      });

      if (response.ok) {
        // Handle successful response (e.g., show a success message)
        console.log('Clinic deleted successfully');
        window.location.reload();
      } else {
        // Handle error response (e.g., show an error message)
        console.error('Failed to delete clinic');
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('An error occurred:', error);
    }
  };

  return (

    <div className="doctor-card" style={{ maxHeight: "200px" }}>
      {isDeleteAccountVisible && (
        <Popup trigger={isDeleteAccountVisible}>
          <div style={{ textAlign: "center", marginBottom: "10px", fontSize: "20px" }}><b>Are you sure you want to delete this clinic?</b></div>
          <button onClick={() => handleDeleteClinic()} style={{ padding: 5, borderRadius: 0, width: "48.5%", textAlign: "center", marginTop: "10px", height: "40px", marginRight: "10px", backgroundColor: "#b22222" }} >Delete Clinic</button>
          <button className='cancel' onClick={closeDeletePopup} style={{ padding: 5, borderRadius: 0, width: "48.5%", textAlign: "center", marginTop: "10px", height: "40px" }}>Cancel</button>
        </Popup>
      )}
      <div className="doctor-info">

        <div className="dinfo" style={{ height: "140px" }}>
          <h2 style={{ lineHeight: 1, padding: '5px 10px', justifyContent: 'center', textAlign: "center" }}>{clinic.name}</h2>
          <p style={{ margin: 0, marginLeft: '6px' }}>Address: {clinic.address}</p>
          <p style={{ margin: 0, marginLeft: '6px' }}>Number: {clinic.officeNumber}</p>
          <p style={{ margin: 0, marginLeft: '6px' }}>Email: {clinic.officeEmail}</p>
          <p style={{ margin: 0, marginLeft: '6px' }}>Hospital Affiliation: {clinic.hospital}</p>
        </div>
        <div style={{ marginBottom: 0 }}>
          <button style={{ marginTop: "5px", padding: 5, borderRadius: 0, width: "128px", marginRight: "10px" }} className="clinic-button" onClick={() => onEdit(clinic)}>Edit</button>
          <button style={{ marginTop: "5px", padding: 5, borderRadius: 0, width: "128px", bottom: 0, backgroundColor: "#b22222" }} className="cancel" onClick={handleDeletePopup}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ClinicCard;