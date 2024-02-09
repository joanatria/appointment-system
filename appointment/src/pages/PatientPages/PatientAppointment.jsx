import React, { useState, useEffect } from 'react';
import PatientNavBar from '../../components/PatientNavBar';
import PatientFooter from '../../components/PatientFooter';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Link, useParams } from 'react-router-dom';
import "../../styles/Calendar.css";
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';
import "../../styles/Load.css";

const PatientAppointment = () => {
  const { username } = useParams();
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState('');
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([
    {
      title: '',
      clinic: '',
      address: '',
      number: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      appointmentId: '',
      appointmentStatus: ''
    },
  ]);
  useEffect(() => {
    // Replace 'https://railway-backend-production-a8c8.up.railway.app/' with your actual API URL
    fetch(`https://railway-backend-production-a8c8.up.railway.app/patuserid/${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        // Once you have the patientUserId, make another request to get appointments
        fetch(`https://railway-backend-production-a8c8.up.railway.app/appointments?patientUserId=${data}`)
          .then((appointmentsResponse) => {
            if (appointmentsResponse.ok) {
              return appointmentsResponse.json();
            }
            throw new Error('Network response was not ok');
          })
          .then((appointmentsData) => {
            // Filter appointments based on clinic deletion status
            const filteredAppointments = appointmentsData.filter(appointment => appointment.clinic.deletionStatus !== "Deleted");
          
            // Map the filtered appointments to the desired format
            const formattedAppointments = filteredAppointments.map((appointment) => {
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
        console.error('Error:', error);
      });
  }, [username]);

  useEffect(() => {
    const fetchLoggedInPatientId = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patuserid/${username}`);
        if (response.ok) {
          setIsPatientLoggedIn(true);
        } else {
          setIsPatientLoggedIn(false);
        }
      } catch (error) {
        setIsPatientLoggedIn(false);
        // Handle the error or provide feedback to the user
      }
    };

    fetchLoggedInPatientId();
  }, [username]);

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

  const handleCancel = async (appointmentId) => {
    try {
      setLoading(true);
      // Find the appointment with the provided appointmentId
      const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

      if (!appointmentToCancel) {
        // Handle the case where the appointment with the given ID is not found
        console.error('Appointment not found');
        return;
      }

      // Check if the appointment is already cancelled
      if (appointmentToCancel.appointmentStatus === 'Cancelled') {
        // Display error message as a pop-up
        window.alert('Appointment is already cancelled');
        return;
      }

      if (appointmentToCancel.appointmentStatus === 'Completed') {
        // Display error message as a pop-up
        window.alert('Appointment is already completed');
        return;
      }

      // Proceed with the request to cancel the appointment
      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/appointmentChange/${appointmentId}?newStatus=Cancelled`, {
        method: 'PUT',
      });

      if (response.ok) {
        console.log('Appointment cancelled successfully');
        window.location.reload();
      } else {
        console.error('Error cancelling appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  };

  const handleReschedule = async (appointmentId) => {
    const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

    if (!appointmentToCancel) {
      // Handle the case where the appointment with the given ID is not found
      console.error('Appointment not found');
      return;
    }

    if (appointmentToCancel.appointmentStatus === 'Completed') {
      // Display error message as a pop-up
      window.alert('Appointment is already completed. It cannot be rescheduled/');
      return;
    }

    // Check if the appointment is already cancelled
    if (appointmentToCancel.appointmentStatus === 'Cancelled') {
      // Display error message as a pop-up
      window.alert('Appointment is already cancelled. It cannot be rescheduled.');
      return;
    }
    window.location.href = `/patresched/${username}/${appointmentId}`;
  };


  const CustomEvent = ({ event }) => (
    <div style={{ margin: '5px 0', whiteSpace: 'nowrap', overflowY: 'auto', maxHeight: "55px", textOverflow: 'ellipsis' }}>
      <strong style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{event.title}</strong>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
        Clinic: {event.clinic}
      </p>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', backgroundColor: getBackgroundColor(event.appointmentStatus) }}>
        {event.appointmentStatus}
      </p>
    </div>
  );


  const getBackgroundColor = (status) => {
    switch (status) {
      case 'Cancelled':
        return '#FCA694';
      case 'Rescheduled':
        return '#FFB97F';
      case 'Scheduled by Patient':
        return '#FFFFDC';
      case 'Approved by Doctor':
        return '#BAFFC4';
      case 'Completed':
        return '#ffffff';
      default:
        return 'lightgray';
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case 'Cancelled':
        return '#A41D00';
      case 'Rescheduled':
        return '#FF7400';
      case 'Scheduled by Patient':
        return '#F8F547';
      case 'Approved by Doctor':
        return '#48DE66';
      case 'Completed':
        return 'lightgray';
      default:
        return 'lightgray';
    }
  };




  appointments.sort((a, b) => {
    const statusOrder = {
      'Cancelled': 5,
      'Completed': 4,
      'Rescheduled': 3,
      'Scheduled by Patient': 2,
      'Approved by Doctor': 1,
    };

    return statusOrder[a.appointmentStatus] - statusOrder[b.appointmentStatus];
  });

  return (
    <div>
      <PatientNavBar username={username} />
      <div style={{ display: "flex", margin: "auto", width: "90vw", justifyContent: "center", marginTop: "2%" }}>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: '70%', }}
          components={{
            event: CustomEvent, // Use the custom Event component
          }}
        />


        <div style={{ marginLeft: "30px", marginTop: "-20px" }}>
          <h1 >My Appointments</h1>
          <div style={{ overflowY: 'auto', maxHeight: '630px' }}>
            {appointments.filter(appointment => appointment).length > 0 ? (
              // Display appointments
              appointments.map((appointment, index) => ((
                <table key={index}>
                  <thead>

                  </thead>
                  <tbody>
                    <tr>
                      <td
                        rowSpan={2}
                        width={200}
                        style={{
                          border: '3px dashed',
                          borderRadius: '5px',
                          borderColor: getBorderColor(appointment.appointmentStatus),
                          backgroundColor: getBackgroundColor(appointment.appointmentStatus),
                          paddingLeft: '10px',
                        }}
                      >
                        {appointment.title} <br />
                        {appointment.clinic} <br />
                        {appointment.address} <br />
                        {appointment.number} <br />
                        {format(appointment.start, 'MM/dd/yyyy EEEE')} <br />
                        {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')} <br />
                        {appointment.appointmentStatus} <br />
                      </td>

                      <td style={{ padding: 0, width: '175px', height: '111px' }}>
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <button onClick={() => handleReschedule(appointment.appointmentId)}
                            style={{
                              width: '100%',
                              height: '100%',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              borderRadius: 5,
                              border: 'none',
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            Reschedule
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: 0, width: '175px', height: '80px' }}>
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                          <button className='cancel' onClick={() => handleCancel(appointment.appointmentId)} type='submit'
                            style={{
                              width: '100%',
                              height: '100%',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              borderRadius: 5,
                              border: 'none',
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
              ))
            ) : (
              // Display a message if there are no appointments with appointmentStatus === "Approved by Doctor"
              <div>
                <p>You have no appointments yet.</p>
                <Link to={`/docsearch/${username}`}>
                  <button>Set an appointment now</button>
                </Link>
              </div>
            )}
          </div>

        </div>

      </div>
      <PatientFooter />
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointment;
