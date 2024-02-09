import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../components/DoctorNavbar';
import DoctorFooter from '../../components/DoctorFooter';
import { Link, useParams } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';
import "../../styles/Load.css";

const ManageAppointments = () => {
  const { username, patientUserId } = useParams();
  const [appointmentActions, setAppointmentActions] = useState({});
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);


  const [appointments, setAppointments] = useState([
    {
      title: '',
      clinic: '',
      address: '',
      patientUserId: '',
      doctorUsername: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      appointmentId: '',
      appointmentStatus: '',
      slots: '',
      deletionStatus: '',
    },
  ]);

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

  const CustomEvent = ({ event }) => {
    // Check if the event is not marked as deleted and doctorUsername matches the specified username
    if (event.deletionStatus === "Deleted" || event.doctorUsername !== username) {
      return null; // Skip rendering if the event is deleted or doctorUsername doesn't match
    }
    return (
      <div style={{ margin: '5px 0', whiteSpace: 'nowrap', overflowY: 'auto', maxHeight: "55px", textOverflow: 'ellipsis' }}>
        <strong style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
          {event.clinic}
        </strong>
        <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
          {event.title}
        </p>
        <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', backgroundColor: getBackgroundColor(event.appointmentStatus) }}>
          {event.appointmentStatus}
        </p>
        <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
          Remaining Slots: {event.slots}
        </p>
      </div>

    );
  };


  useEffect(() => {
    fetch(`https://railway-backend-production-a8c8.up.railway.app/appointments?patientUserId=${patientUserId}`)
      .then((appointmentsResponse) => {
        if (appointmentsResponse.ok) {
          return appointmentsResponse.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((appointmentsData) => {
        const formattedAppointments = appointmentsData.map((appointment, index) => {
          // Extract date and time components
          const [year, month, day] = appointment.scheduleDate.split('-').map(Number);
          const [hours, minutes] = appointment.startTime.split(':').map(Number);
          const [hours2, minutes2] = appointment.endTime.split(':').map(Number);

          // Create Date objects for start and end times
          const startDate = new Date(year, month - 1, day, hours, minutes);
          const endDate = new Date(year, month - 1, day, hours2, minutes2);

          setAppointmentActions(prevState => ({
            ...prevState,
            [index]: false
          }));
          // Create an appointment object
          return {
            title: appointment.patientName,
            clinic: appointment.clinicName,
            address: appointment.address,
            patientUserId: appointment.patientUserId,
            doctorUsername: appointment.doctorUser.username,
            start: startDate,
            end: endDate,
            appointmentId: appointment.transactionNo,
            appointmentStatus: appointment.status,
            slots: appointment.slots,
            deletionStatus: appointment.clinic.deletionStatus,


          };
        });

        setAppointments(formattedAppointments);
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });
  }, [patientUserId]);

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
      if (appointmentToCancel.appointmentStatus === 'Completed') {
        // Display error message as a pop-up
        window.alert('Appointment is already completed. It cannot be cancelled');
        return;
      }
      const currentDateTime = new Date();
      const appointmentStartTime = appointmentToCancel.start;

      // Calculate the difference in milliseconds
      const timeDifference = appointmentStartTime - currentDateTime;

      // Define the duration of 24 hours in milliseconds
      const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

      if (timeDifference < twentyFourHoursInMilliseconds) {
        window.alert('The appointment cannot be cancelled 24 hours before the appointment.');
        return;
      }
      // Check if the appointment is already cancelled
      if (appointmentToCancel.appointmentStatus === 'Cancelled') {
        // Display error message as a pop-up
        window.alert('Appointment is already cancelled');
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
    try {

      const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

      if (!appointmentToCancel) {
        console.error('Appointment not found');
        return;
      }
      if (appointmentToCancel.appointmentStatus === 'Completed') {
        window.alert('Appointment is already completed. It cannot be rescheduled.');
        return;
      }
      const currentDateTime = new Date();
      const appointmentStartTime = appointmentToCancel.start;

      // Calculate the difference in milliseconds
      const timeDifference = appointmentStartTime - currentDateTime;

      // Define the duration of 24 hours in milliseconds
      const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

      if (timeDifference < twentyFourHoursInMilliseconds) {
        window.alert('The appointment cannot be rescheduled 24 hours before the appointment.');
        return;
      }
      

      if (appointmentToCancel.appointmentStatus === 'Cancelled') {
        window.alert('Appointment is already cancelled. It cannot be rescheduled.');
        return;
      }


      // Navigate to the reschedule page after the delay
      window.location.href = `/docresched/${username}/${appointmentId}`;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };


  const handleViewProfile = async (patientUserId) => {
    const appointmentToCancel = appointments.find(appointment => appointment.patientUserId === patientUserId);

    if (!appointmentToCancel) {
      // Handle the case where the appointment with the given ID is not found
      console.error('Appointment not found');
      return;
    }

    window.location.href = `/viewprofile/${username}/${patientUserId}`;
  };

  const handleApprove = async (appointmentId) => {
    try {
      setLoading(true);

      const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

      if (!appointmentToCancel) {
        console.error('Appointment not found');
        return;
      }

      if (appointmentToCancel.appointmentStatus === 'Cancelled') {
        window.alert('Appointment is already cancelled');
        return;
      }

      if (appointmentToCancel.appointmentStatus === 'Completed') {
        window.alert('Appointment is already completed');
        return;
      }

      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/appointmentChange/${appointmentId}?newStatus=Approved by Doctor`, {
        method: 'PUT',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error approving appointment');
      }
    } catch (error) {
      console.error('Error approving appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsComplete = async (appointmentId) => {
    try {
      setLoading(true);

      const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);

      if (!appointmentToCancel) {
        console.error('Appointment not found');
        return;
      }

      if (appointmentToCancel.appointmentStatus === 'Completed') {
        window.alert('Appointment is already completed');
        return;
      }

      const currentDateTime = new Date();

  
      
      if (currentDateTime < appointmentToCancel.end) {
        window.alert('The appointment cannot be set as completed.');
        return;
      }

      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/appointmentChange/${appointmentId}?newStatus=Completed`, {
        method: 'PUT',
      });

      if (response.ok) {
      } else {
        console.error('Error marking appointment as completed');
      }
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
    } finally {
      setLoading(false);
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
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/doctordetails/${username}`);
        if (response.ok) {
          setIsDoctorLoggedIn(true);

        } else {
          setIsDoctorLoggedIn(false);

        }
      } catch (error) {
        console.error('Error fetching user:', error);
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
    <div>
      <DoctorNavbar username={username} />
      <div style={{ display: "flex", margin: "auto", width: "100vw", justifyContent: "center" }}>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: "70%" }}
          components={{
            event: CustomEvent, // Use the custom Event component
          }}
        />

        <div style={{ marginLeft: "30px" }}>
          <h1 style={{ marginTop: "0" }}>Appointment History</h1>
          <table style={{ width: "520px" }}>
            <tr >
              <td colSpan={2} onClick={() => handleViewProfile(appointments[0].patientUserId)}>
                <div style={{
                  width: '600',
                  fontSize: '20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}> <b>{appointments[0].title}</b> </div>
              </td>
            </tr>
          </table>

          <div style={{ overflowY: 'auto', maxHeight: '650px' }}>
            {appointments
              .filter(appointment => appointment.doctorUsername === username && appointment.deletionStatus !== "Deleted")
              .map((appointment, index) => (
                <table key={index} style={{ width: "480px" }}>
                  <br />
                  <tr>
                    <td
                      rowSpan={2}
                      width={200}
                      style={{
                        backgroundColor: getBackgroundColor(appointment.appointmentStatus),
                        paddingTop: '5px',
                        paddingBottom: '5px',
                        paddingLeft: '10px',
                        borderStyle: 'dashed',
                        borderWidth: '2px',
                        borderRadius: '5px',
                        borderColor: getBorderColor(appointment.appointmentStatus),
                      }}
                    >
                      {appointment.clinic} <br />
                      {appointment.address} <br />
                      {format(appointment.start, 'MM/dd/yyyy EEEE')} <br />
                      {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')} <br />
                      <div style={{ borderColor: getBorderColor(appointment.appointmentStatus) }}>{appointment.appointmentStatus}</div>
                    </td>
                    <td>
                    <div style={{ position: 'relative', display: 'inline-block' }} key={index}>
                      <button
                        style={{
                          padding: 10,
                          marginLeft: "10px",
                          height: appointmentActions[index] ? '32px' : '65px',
                          width: "250px",
                          borderRadius: '5px',
                          backgroundColor: appointmentActions[index] ? '#fff' : '#fff',
                          color: appointmentActions[index] ? '#000000' : '#333'
                        }}
                        onClick={() => setAppointmentActions(prevState => ({
                          ...prevState,
                          [index]: !prevState[index]
                        }))}
                      >
                        Appointment Options
                      </button>

                      {appointmentActions[index] && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1 }}>
                          <button
                            style={{ padding: 7, width: "250px", borderRadius: '5px', backgroundColor: '#76AD83', color: '#fff', marginLeft: "10px" }}
                            onClick={() => handleApprove(appointment.appointmentId)}
                            type='submit'
                          >
                            Approve Appointment
                          </button>
                          <button
                            style={{ padding: 7, width: "250px", borderRadius: '5px', backgroundColor: '#FA8072', color: '#fff', marginLeft: "10px" }}
                            onClick={() => handleReschedule(appointment.appointmentId)}
                          >
                            Reschedule Appointment
                          </button>
                          <button
                            style={{ padding: 7, width: "250px", borderRadius: '5px', backgroundColor: '#0094d4', color: '#fff', marginLeft: "10px" }}
                            onClick={() => handleSetAsComplete(appointment.appointmentId)}
                            type='submit'
                          >
                            Set as completed
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  </tr>
                  <tr>
                    <td>
                      <button className='cancel' style={{ padding: 0, marginLeft: "10px", height: "65px", width: "250px", borderRadius: '5px' }} onClick={() => handleCancel(appointment.appointmentId)} type='submit'>
                        Cancel Appointment
                      </button>
                    </td>
                  </tr>

                </table>


              ))}


          </div>

        </div>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      <DoctorFooter />
    </div>
  )
};

export default ManageAppointments
