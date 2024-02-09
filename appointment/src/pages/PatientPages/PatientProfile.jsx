import React, { useEffect, useState } from 'react';
import "../../styles/Profile.css";
import PatientNavBar from '../../components/PatientNavBar';
import PatientFooter from '../../components/PatientFooter';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';
import avatar00 from '../../images/defaultIcon.png';
import avatar01 from '../../assets/PatientIcons/Avatar01.png';
import avatar02 from '../../assets/PatientIcons/Avatar02.png';
import avatar03 from '../../assets/PatientIcons/Avatar03.png';
import avatar04 from '../../assets/PatientIcons/Avatar04.png';
import avatar05 from '../../assets/PatientIcons/Avatar05.png';
import avatar06 from '../../assets/PatientIcons/Avatar06.png';
import avatar07 from '../../assets/PatientIcons/Avatar07.png';
import avatar08 from '../../assets/PatientIcons/Avatar08.png';
import avatar09 from '../../assets/PatientIcons/Avatar09.png';
import avatar10 from '../../assets/PatientIcons/Avatar10.png';
import avatar11 from '../../assets/PatientIcons/Avatar11.png';
import avatar12 from '../../assets/PatientIcons/Avatar12.png';
import avatar13 from '../../assets/PatientIcons/Avatar13.png';
import avatar14 from '../../assets/PatientIcons/Avatar14.png';
import avatar15 from '../../assets/PatientIcons/Avatar15.png';
import avatar16 from '../../assets/PatientIcons/Avatar16.png';
import avatar17 from '../../assets/PatientIcons/Avatar17.png';
import avatar18 from '../../assets/PatientIcons/Avatar18.png';
import { useParams, Link } from 'react-router-dom';

const PatientProfile = () => {
    const { username } = useParams();
    const [isPatientLoggedIn, setIsPatientLoggedIn] = useState('');
    const [avatar, setAvatar] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [user, setUser] = useState(null);
    const [isError, setIsError] = useState(false);
    const [patientUserId, setPatientUserId] = useState('');
    const [appointments, setAppointments] = useState([
      {
        title: '',
        clinic: '',
        address: '',
        number: '',
        start: new Date(),
        end: new Date(),  // 5:00 PM
        transactionNo: '',
        appointmentStatus: ''
      },
    ]);

 
    useEffect(() => {
    const fetchUser = async () => {
        try {
          const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patientdetails/${username}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setPatientUserId(data.userId);
            setAvatar(data.user.avatar);
            setIsPatientLoggedIn(true);

          } else {
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setIsError(true);
          setIsPatientLoggedIn(false);

        }
    };

    
      fetchUser();
    }, [username]);

  const setDisplayedAvatars = (avatar) => {
    const avatarImports = {
      'patavatar01': avatar01,
      'patavatar02': avatar02,
      'patavatar03': avatar03,
      'patavatar04': avatar04,
      'patavatar05': avatar05,
      'patavatar06': avatar06,
      'patavatar07': avatar07,
      'patavatar08': avatar08,
      'patavatar09': avatar09,
      'patavatar10': avatar10,
      'patavatar11': avatar11,
      'patavatar12': avatar12,
      'patavatar13': avatar13,
      'patavatar14': avatar14,
      'patavatar15': avatar15,
      'patavatar16': avatar16,
      'patavatar17': avatar17,
      'patavatar18': avatar18
    };

    // Set selectedAvatar using the corresponding import
    setSelectedAvatar(avatarImports[avatar] || avatar00);
  };


  useEffect(() => {
    fetch(`https://railway-backend-production-a8c8.up.railway.app/patuserid/${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        fetch(`https://railway-backend-production-a8c8.up.railway.app/appointments?patientUserId=${data}`)
          .then((appointmentsResponse) => {
            if (appointmentsResponse.ok) {
              return appointmentsResponse.json();
            }
            throw new Error('Network response was not ok');
          })
          .then((appointmentsData) => {
            const formattedAppointments = appointmentsData
              .filter(appointment => appointment.clinic.deletionStatus !== "Deleted" && appointment.patientUser.username === username)
              .map((appointment) => {
                // Extract date and time components
                const [year, month, day] = appointment.scheduleDate.split('-').map(Number);
                const [hours, minutes] = appointment.startTime.split(':').map(Number);
                const [hours2, minutes2] = appointment.endTime.split(':').map(Number);
          
                // Create Date objects for start and end times
                const startDate = new Date(year, month - 1, day, hours, minutes);
                const endDate = new Date(year, month - 1, day, hours2, minutes2);
          
                // Create an appointment object
                return {
                  title: 'Dr. ' + appointment.doctorName,
                  clinic: appointment.clinicName,
                  address: appointment.address,
                  number: appointment.clinic.officeNumber,
                  start: startDate,
                  end: endDate,
                  appointmentId: appointment.transactionNo,
                  appointmentStatus: appointment.status,
                };
              });

            setAppointments(formattedAppointments);
          })
          .catch((error) => {
            // Handle errors
            console.error(error);
          });

      })
      .catch((error) => {
        setIsError(true);
        console.error('Error:', error);
      });
  }, [username]);
    const locales = {
      "en-US": require("date-fns/locale/en-US")
    }
  
    const localizer = dateFnsLocalizer({
      format,
      parse,
      startOfWeek,
      getDay,
      locales
    })
  
    useEffect(() => {
      setDisplayedAvatars(avatar);
  
    }, [avatar]);

 


  
    if (!isPatientLoggedIn) {
      return (
        <div>
          <HomeNavbar />
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Patient not logged in.</h1>
            <Link to="/login"><button>Login</button></Link>
          </div>
          <HomeFooter />
        </div>
  
      );
    }
    
  return (
    <div className="profile-container" id="container">
      <PatientNavBar username={username} />
      <div className="doctorprofilecontainer" style={{marginTop: "1%", overflow: "hidden", height: "100%"}}>
        {user ? (
          <div className="parentelement">
            <div className="columns" id="columnprofileicon" style={{marginTop: '1%', height: "700px"}}>
              <div className="backgroundpop"></div>
              <div className="doctorprofileicon">
                {selectedAvatar && <img src={selectedAvatar} alt="Selected Avatar" />}
              </div>
              <div className="doctorprofilename">
                <p className="pn">
                  <b>{user.user.firstName} {user.user.middleName} {user.user.lastName}</b>
                </p>
              </div>
              <div className="doctorprofiletitle">
                <p className="pt">
                  <i>{user.credentials}</i>
                </p>
              </div>
              <div className="listofdocprofilecontent">
                <ul className="profile-list">
                <li><a href="#account">Account Details</a></li>
                  <li><a href="#personal">Personal Information</a></li>
                  <li><a href="#additional">Additional Information</a></li>
                  <li><a href="#columnprofileappointments">Appointments</a></li>
                </ul>
              </div>
            </div>
            <div className="columns" id="columnprofileinformation" style={{marginTop: '0%', overflowY: 'auto', maxHeight: '760px' }} >
              <div className="doctorprofilecontent">
                <div className="mydoctorprofileaccount" id="account">
                  <div className="backgroundpop">
                    <div className="doctorprofilecontenttitles">
                      <p><b>ACCOUNT</b></p>
                    </div>
                    <div className="contentcolumn">
                      <div className="contentcolumn1">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Username: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.username}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Email: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mydoctorprofilepersonal"  id="personal">
                  <div className="backgroundpop">
                    <div className="doctorprofilecontenttitles ">
                      <p><b>PERSONAL INFORMATION</b></p>
                    </div>
                    <div className="contentcolumn">
                      <div className="contentcolumn1">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Sex: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.sex}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Age: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.age}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Birthday: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.birthday}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Contact Number: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.contactNumber}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Address: </p>
                          </div>
                          <div className="datainfo">
                            {user.user.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mydoctorprofilesecretary"  id="additional">
                <div className="backgroundpop">
                    <div className="doctorprofilecontenttitles">
                      <p><b>ADDITIONAL INFORMATION</b></p>
                    </div>
                    <div className="contentcolumn">
                      <div className="contentcolumn1">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Senior Citizen ID: </p>
                          </div>
                          <div className="datainfo">
                            {user.seniorId}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Philhealth ID: </p>
                          </div>
                          <div className="datainfo">
                            {user.philhealthId}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>PWD ID No: </p>
                          </div>
                          <div className="datainfo">
                            {user.pwdId}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            <div className="columns" id="columnprofileappointments" style={{
                    marginTop: "1%",
                    position: "sticky", /* Set the position to sticky */
                    top: "20px", /* Adjust the top value as needed */
                    zIndex: "100", /* Set a z-index to control stacking with other elements */
                    backgroundColor: "white", /* Background color if needed */
                  }}>
              <div className="futureappointments">
                <div className="doctorappoinmentcard">
                  <div className="backgroundpop">
                    <div className="titleappointment">
                      <p><b>CALENDAR</b></p>
                    </div>
                    <div className="doctorcalendar">
                      <Calendar
                        localizer={localizer}
                        events={appointments}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 300, width: "84%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          isError ? (
            <p>Error fetching user profile</p>
          ) : (
            <p>Loading user profile...</p>
          )
        )}
      </div>
      <PatientFooter />
    </div>
  );
};

export default PatientProfile;