import React, { useEffect, useState } from 'react';
import "../../styles/Profile.css";
import DoctorNavbar from '../../components/DoctorNavbar';
import DoctorFooter from '../../components/DoctorFooter';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useParams } from 'react-router-dom';
import avatar00 from '../../images/defaultIcon.png';
import avatar01 from '../../assets/DoctorIcons/Icon01.png';
import avatar02 from '../../assets/DoctorIcons/Icon02.png';
import avatar03 from '../../assets/DoctorIcons/Icon03.png';
import avatar04 from '../../assets/DoctorIcons/Icon04.png';
import avatar05 from '../../assets/DoctorIcons/Icon05.png';
import avatar06 from '../../assets/DoctorIcons/Icon06.png';
import avatar07 from '../../assets/DoctorIcons/Icon07.png';
import avatar08 from '../../assets/DoctorIcons/Icon08.png';
import avatar09 from '../../assets/DoctorIcons/Icon09.png';
import avatar10 from '../../assets/DoctorIcons/Icon10.png';
import avatar11 from '../../assets/DoctorIcons/Icon11.png';
import avatar12 from '../../assets/DoctorIcons/Icon12.png';
import avatar13 from '../../assets/DoctorIcons/Icon13.png';
import avatar14 from '../../assets/DoctorIcons/Icon14.png';
import HomeNavbar from '../../components/HomeNavbar';
import HomeFooter from '../../components/HomeFooter';


const DoctorProfile = () => {
  const {username} = useParams();
  const [avatar, setAvatar] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      title: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      appointmentId: '',
      appointmentStatus: ''
    },
  ]);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState('');

  

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
    fetch(`https://railway-backend-production-a8c8.up.railway.app/getDoctorUserId?username=${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        fetch(`https://railway-backend-production-a8c8.up.railway.app/docappointments?doctorUserId=${data}`)
          .then((appointmentsResponse) => {
            if (appointmentsResponse.ok) {
              return appointmentsResponse.json();
            }
            throw new Error('Network response was not ok');
          })
          .then((appointmentsData) => {
            const formattedAppointments = appointmentsData
              .filter(appointment => appointment.clinic.deletionStatus !== "Deleted" && appointment.doctorUser.username === username)
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
                  title: appointment.patientName,
                  start: startDate,
                  end: endDate,
                  appointmentId: appointment.transactionNo,
                  appointmentStatus: appointment.status
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

  }, [avatar]);  // Add the dependency array to avoid unnecessary re-renders
  useEffect( () => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/doctordetails/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setAvatar(data.user.avatar);
          setIsDoctorLoggedIn(true);
  
        } else {
          setIsDoctorLoggedIn(false);
  
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsError(true);
        setIsDoctorLoggedIn(false);
  
      }
    };
    fetchUser();
  }, [username]);
  
  if (!isDoctorLoggedIn) {
    return (
      <div>
        <HomeNavbar />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>No doctor is logged in.</h1>
          <Link to="/doclogin"><button>Login</button></Link>
        </div>
        <HomeFooter />
      </div>
  
    );
  }
  return (
    <div className="profile-container" id="container">
      <DoctorNavbar username={username} />
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
                  <li><a href="#accountDetails">Account Details</a></li>
                  <li><a href="#personalDetails">Personal Information</a></li>
                  <li><a href="#credDetails">Credentials</a></li>
                  <li><a href="#secDetails">Secretary Details</a></li>
                </ul>
              </div>
            </div>
            <div className="columns" id="columnprofileinformation" style={{marginTop: '0%', overflowY: 'auto', maxHeight: '720px' }} >
              <div className="doctorprofilecontent">
                <div className="mydoctorprofileaccount" id="accountDetails">
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
                <div className="mydoctorprofilepersonal"  id="personalDetails">
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
                <div className="mydoctorprofilecredentials"  id="credDetails">
                  <div className="backgroundpop">
                    <div className="doctorprofilecontenttitles">
                      <p><b>CREDENTIALS</b></p>
                    </div>
                    <div className="contentcolumn">
                      <div className="contentcolumn1">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Credentials: </p>
                          </div>
                          <div className="datainfo">
                            {user.credentials}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>Specialization: </p>
                          </div>
                          <div className="datainfo">
                            {user.specialization}
                          </div>
                        </div>
                      </div>
                      <div className="contentcolumn2">
                        <div className="contentrow">
                          <div className="dataname">
                            <p>PRC ID No: </p>
                          </div>
                          <div className="datainfo">
                            {user.prcId}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mydoctorprofilesecretary"  id="secDetails">
                  <div className="backgroundpop">
                    <div className="doctorprofilecontenttitles">
                      <p><b>SECRETARY</b></p>
                    </div>
                    <div className="contentcolumn">
                      {user.secretary ? (
                        <>
                          <div className="contentcolumn1">
                            <div className="contentrow">
                              <div className="dataname">
                                <p>Name: </p>
                              </div>
                              <div className="datainfo">
                                {user.secretary.split(' - ')[0].replace('Secretary - ', '')}
                              </div>
                            </div>
                          </div>
                          <div className="contentcolumn2">
                            <div className="contentrow">
                              <div className="dataname">
                                <p>Contact Number: </p>
                              </div>
                              <div className="datainfo">
                                {user.secretary.split(' - ')[1]}
                              </div>
                            </div>
                          </div>
                          <div className="contentcolumn2">
                            <div className="contentrow">
                              <div className="dataname">
                                <p>Email: </p>
                              </div>
                              <div className="datainfo">
                                {user.secretary.split(' - ')[2]}
                              </div>
                            </div>
                          </div>
                          <div className="contentcolumn2">
                            <div className="contentrow">
                              <div className="dataname">
                                <p>Clinic Information: </p>
                              </div>
                              <div className="datainfo">
                                {user.secretary.split(' - ')[3]}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p>No secretary information available</p>
                      )}
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
      <DoctorFooter />
    </div>
  );
};

export default DoctorProfile;