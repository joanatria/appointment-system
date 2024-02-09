import React, { useState, useEffect, useCallback } from 'react';
import "../../styles/Register.css";
import Popup from '../../components/Popup';
import HomeNavbar from '../../components/HomeNavbar';
import HomeFooter from '../../components/HomeFooter';
import "../../styles/Load.css";


const PatientRegister = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [seniorId, setSeniorId] = useState('');
  const [pwdId, setPwdId] = useState('');
  const [philhealthId, setPhilhealthId] = useState('');
  const [hmo, setHmo] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [userType] = useState('patient');
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSignup = async () => {
    // Check if any of the fields are empty
    if (
      !username ||
      !firstName ||
      !lastName ||
      !age ||
      !sex ||
      !birthday ||
      !address ||
      !contactNumber ||
      !email ||
      !password ||
      !retypePassword
    ) {
      setSignupMessage('Please fill in all required fields.');
      return;
    }
    if (password !== retypePassword) {
      setSignupMessage('Passwords do not match.');
      return;
    }

    // Validate password length
    if (password.length < 7 || !/\d/.test(password)) {
      setSignupMessage('Password should be at least 7 characters long and must contain at least 1 number.');
      return;
    }

    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(contactNumber)) {
      setSignupMessage('Contact number should be exactly 10 digits and contain only numbers (0-9).');
      return;
    }

    // Validate email format using regular expression
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setSignupMessage('Invalid email format.');
      return;
    }

    try {
      setLoading(true);
      const url = new URL('https://railway-backend-production-a8c8.up.railway.app/patients');
      const userData = {
        user: {
        username,
        firstName,
        middleName,
        lastName,
        age,
        sex,
        birthday,
        address,
        contactNumber,
        email,
        password,
        userType
      },
        patient: {
        seniorId,
        pwdId,
        philhealthId,
        hmo
        }
      };


      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Signup successful
        setSignupMessage('User added successfully');
        setRegistrationSuccessful(true);

 
      } else {
        // Signup failed
        setSignupMessage(`Signup failed`);
        // Handle the error or display an error message to the user
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupMessage('Error during signup. Please try again later.');
      // Handle the error or display an error message to the user
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  }


  const handleVerification = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patientverify?email=${email}&otp=${otp}`, {
        method: 'POST',
      });

      if (response.ok) {
        const verificationResult = await response.text();
        setMessage(verificationResult);
        if (verificationResult === 'Successful verification.') {
          window.location.href = '/login'; // Redirect to the login page
        } else {
          setMessage('Unsuccessful verification.');
        }
      } else {
        setMessage('Unsuccessful verification.');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  };

  
  const handleOtpChange = (e) => {
    const inputOtp = e.target.value;
    setOtp(inputOtp);
  };


  const calculateAge = useCallback(() => {
    // Ensure the birthday is not empty
    if (birthday) {
      const birthDate = new Date(birthday);
      const currentDate = new Date();

      let calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();

      // Adjust age if birthday hasn't occurred yet this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }

      setAge(calculatedAge);
    }
  }, [birthday]);
  useEffect(() => {
    calculateAge();
  }, [birthday, calculateAge]);
  

  const handleChange = (e) => {
    const userInput = e.target.value.replace(/\D/g, '').slice(0, 10);
    setContactNumber(userInput);
  
    console.log(userInput);
  };  

  return (
    <div>
    <div className="reg-container" id="reg-container">
      <HomeNavbar />
      <div className="register">
        <h1 style={{ color: '#0094d4' }}>Patient Register</h1>
        <form action="#" id="register-form">
          <div className="reg-row">
            <div className="reg-infield">
              <input 
                type="text"
                id="username"
                placeholder="*Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '690px' }} />
            </div>
          </div>
          <div className="reg-row">
            <div className="reg-infield">
              <input type="text"
                id="lastName"
                placeholder="*Last Name"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}/>
            </div>
            <div className="reg-infield">
              <input  type="text"
                id="firstName"
                placeholder="*First Name"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="reg-infield">
              <input type="text"
                id="middleName"
                placeholder="Middle Name"
                name="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)} />
            </div>
          </div>
  
          <div className="reg-row">
          <div className="reg-infield" style={{ width: "50px", marginRight: "-10"}}> 
              <p style={{margin: "0", padding: "10px 0", color: "grey", fontSize: "12px"}}>*Age</p>
            </div>
            <div className="reg-infield" style={{ width: "275px"}}>
              <input
                  readOnly="readOnly"
                  id="age"
                  placeholder={age}
                  name="age"
                  min="1"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <div className="reg-infield">
              <select 
                id="sex"
                placeholder="*Sex"
                name="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}>
                  <option value="" disabled>Sex</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="prefer not to say">Prefer Not To Say</option>
              </select>
              </div>
          </div>
          <div className="reg-row">
            <div className="reg-infield" style={{ width: "50px", marginRight: "-10"}}> 
              <p style={{margin: "0", padding: "10px 0", color: "grey", fontSize: "12px"}}>*Birthdate</p>
            </div>
            <div className="reg-infield" style={{ width: "150px"}}>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={birthday}
                style={{padding: "8px 8px"}}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>
            <div className="reg-infield" style={{ width: "500px"}}>
              <input
                type="text"
                id="address"
                placeholder="*(House/Lot/Unit No., Street, Barangay, City/Town, Province)"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="reg-row">
          <div className="reg-infield" style={{marginRight: "-300px"}}>
              <input
                type="text"
                placeholder="+63 "
                name="+63"
                readOnly
                style={{width: "50px"}}
              />
            </div>
            <div className="reg-infield" style={{width: "290px"}}>
              <input
                type="text"
                id="contactNumber"
                placeholder="9999999999"
                name="contactNumber"
                value={contactNumber}
                onChange={handleChange}
              />
            </div>
            <div className="reg-infield">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="reg-row">
          <div className="reg-infield" style={{ width: "250px", marginRight: "-125px"}}> 
              <p style={{margin: "0", padding: "10px 0", color: "grey", fontSize: "12px"}}>Senior Citizen ID</p>
            </div>
            <div className="reg-infield" style={{ width: "200px"}}>
              <input
                type="text"
                placeholder="00000"
                id="seniorId"
                name="seniorId"
                value={seniorId}
                onChange={(e) => setSeniorId(e.target.value.replace(/\D/g, '').slice(0, 5))}
              />
            </div>
            <div className="reg-infield" style={{ width: "250px", marginRight: "-125px"}}> 
              <p style={{margin: "0", padding: "10px 0", color: "grey", fontSize: "12px"}}>PWD ID</p>
            </div>
            <div className="reg-infield" style={{ width: "200px"}}>
              <input
                type="text"
                placeholder="00000-00000-00000"
                id="pwdId"
                name="pwdId"
                value={pwdId}
                onChange={(e) => setPwdId(e.target.value.replace(/\D/g, '').slice(0, 15))}
              />
            </div>
          </div>
          <div className="reg-row">
          <div className="reg-infield" style={{ width: "250px", marginRight: "-125px"}}> 
              <p style={{margin: "0", padding: "10px 0", color: "grey", fontSize: "12px"}}>PhilHealth ID</p>
            </div>
            <div className="reg-infield" style={{ width: "200px"}}>
              <input
                type="text"
                placeholder="0000-0000-0000"
                id="philhealthId"
                name="philhealthId"
                value={philhealthId}
                onChange={(e) => setPhilhealthId(e.target.value.replace(/\D/g, '').slice(0, 12))}
              />
            </div>
            <div className="reg-infield">
              <input
                type="text"
                placeholder="Health Insurance/HMO"
                id="hmo"
                name="hmo"
                value={hmo}
                onChange={(e) => setHmo(e.target.value)}
              />
            </div>
          </div>
          <div className="reg-row">
            <div className="reg-infield">
              <input
                type="password"
                placeholder="*Password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="reg-infield">
              <input
                type="password"
                placeholder="*Re-enter Password"
                id="retypePassword"
                name="retypePassword"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
              />
            </div>
          </div>
          <button type="button" onClick={handleSignup}> Register</button>
          {signupMessage && <p className="signup-message">{signupMessage}</p>}
          {registrationSuccessful && (
          <Popup trigger={true}>
            <form action="#" id="signin-form">
              <div className="infield">
                <h1 style={{ textAlign: 'center' }}>Verification</h1>
                <input
                  type="code"
                  placeholder="Verification Code"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                />
              </div>
              <button type="button" onClick={handleVerification}>Submit Code</button>
              {message && <p>{message}</p>}
            </form>
          </Popup>
          )} 
        </form>
      </div>
    </div>
    {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
    <HomeFooter />
    </div>
  );
};

export default PatientRegister;

