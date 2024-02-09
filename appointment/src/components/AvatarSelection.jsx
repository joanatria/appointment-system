import React from 'react';
import PropTypes from 'prop-types';
import '../../src/styles/Profile.css';


const AvatarSelectionPopup = ({ avatars, selectedAvatar, onSelectAvatar, onClose }) => {
  return (
    <div className="avatar-selection-popup">
      <div className="avatar-selection-header">
        <h2>Select Profile Picture</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="avatar-selection-grid">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-item ${selectedAvatar === avatar ? 'selected' : ''}`}
            onClick={() => onSelectAvatar(avatar)}
          >
            <img src={avatar} alt={`Avatar ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

AvatarSelectionPopup.propTypes = {
  avatars: PropTypes.array.isRequired,
  selectedAvatar: PropTypes.string,
  onSelectAvatar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarSelectionPopup;