import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DoctorNavbar from '../../components/DoctorNavbar';
import DoctorFooter from '../../components/DoctorFooter';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, format } from 'date-fns';
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import addWeeks from 'date-fns/addWeeks';
import "react-big-calendar/lib/css/react-big-calendar.css";

const DoctorResched = () => {
  const { username, appointmentId } = useParams();
  const [rescheduleChoice, setRescheduleChoice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rescheduleStatus, setRescheduleStatus] =  useState('');
  const [latestAppointment, setLatestAppointment] = useState([
    {
      title: '',
      clinic: '',
      address: '',
      number: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      transactionNo: '',
      appointmentStatus: '',
      slots:''
    },
  ]);
  const [appointments, setAppointments] = useState([
    {
      title: '',
      clinic: '',
      address: '',
      number: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      transactionNo: '',
      appointmentStatus: '',
      slots:''
    },
  ]);

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
            const formattedAppointments = appointmentsData.map((appointment) => {
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
                clinic: appointment.clinicName,
                address: appointment.address,
                number: appointment.clinic.officeNumber,
                start: startDate,
                end: endDate,
                appointmentId: appointment.transactionNo,
                appointmentStatus: appointment.status,
                slots: appointment.slots
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
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/appointment/${appointmentId}`);

        if (response.ok) {
          const data = await response.json();

          // Check if necessary properties are present in the data object
          if (data && data.scheduleDate && data.startTime && data.endTime && data.doctorName && data.transactionNo && data.status) {
            const [year, month, day] = data.scheduleDate.split('-').map(Number);
            const [hours, minutes] = data.startTime.split(':').map(Number);
            const [hours2, minutes2] = data.endTime.split(':').map(Number);

            // Check if the extracted components are valid numbers
            if (!isNaN(year) && !isNaN(month) && !isNaN(day) && !isNaN(hours) && !isNaN(minutes) && !isNaN(hours2) && !isNaN(minutes2)) {
              // Create Date objects for start and end times
              const startDate = new Date(year, month - 1, day, hours, minutes);
              const endDate = new Date(year, month - 1, day, hours2, minutes2);

              // Check if the created Date objects are valid
              if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const formattedAppointment = {
                  title: data.patientName,
                  clinic: data.clinicName,
                  address: data.address,
                  number: data.clinic.officeNumber,
                  start: startDate,
                  end: endDate,
                  appointmentId: data.transactionNo,
                  appointmentStatus: data.status,
                  slots: data.slots
                };

                setLatestAppointment([formattedAppointment]);
              } else {
                console.error('Invalid date created. Check the date and time components.');
              }
            } else {
              console.error('Invalid date/time components in the response data.');
            }
          } else {
            console.error('Incomplete or missing data in the response.');
          }
        } else {
          setError('Error fetching appointment');
        }
      } catch (error) {
        setError('Error fetching appointment');
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleRescheduleChange = (event) => {
    const match = event.target.value.match(/(\d{2})\/(\d{2})\/(\d{4})/);

    if (!match) {
      return <div>Error: Invalid date format</div>;
    }

    const [, month, day, year] = match;
    const sourceDate = new Date(`${year}-${month}-${day}`);
    setRescheduleChoice(`${sourceDate.getFullYear()}-${(sourceDate.getMonth() + 1).toString().padStart(2, '0')}-${sourceDate.getDate().toString().padStart(2, '0')}`);

  };

  const handleReschedule = async () => {
    try {
      setLoading(true);

      const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/appointment/${appointmentId}?scheduleDate=${rescheduleChoice}`, {
        method: 'PUT',
        // No need for headers when not sending a JSON payload
      });
      if (response.ok) {
        setRescheduleStatus('Appointment Rescheduled Successfully!');
        window.location.href = `/docresched/${username}/${appointmentId}`;
      }
      if (!response.ok) {
        setRescheduleStatus(`Failed to update appointment: ${response.statusText}`);
        throw new Error(`Failed to update appointment: ${response.statusText}`);
        
      }

    } catch (error) {
      console.error('Error updating appointment:', error.message);
      setError('Error updating appointment:', error.message);
    }finally{
      setLoading(false);
    }
  };

  const generateDateOptions = ({ scheduleDate }) => {
    if (!scheduleDate) {
      console.error('Error: scheduleDate is undefined.');
      return [];
    }
  
    // Convert the Date object to a string
    const scheduleDateString = scheduleDate.toString();
    
    // Convert the string back to a Date object
    const startDate = new Date(scheduleDateString);
    
    const dateOptions = [];
  
    for (let i = 0; i < 4; i++) {
      const optionDate = addWeeks(startDate, i);
      
      // Format the date using date-fns
      const formattedDate = format(optionDate, "MM/dd/yyyy EEEE");
  
      dateOptions.push(
        <option key={i} value={formattedDate}>
          {formattedDate}
        </option>
      );
    }
  
    return dateOptions;
  };

  const CustomEvent = ({ event }) => (
    <div style={{ margin: '5px 0', whiteSpace: 'nowrap', overflowY: 'auto', maxHeight: "55px", textOverflow: 'ellipsis' }}>
      <strong style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{event.title}</strong>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
        Clinic: {event.clinic}
      </p>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', backgroundColor: getBackgroundColor(event.appointmentStatus)}}>
        Status: {event.appointmentStatus}
      </p>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal'}}>
        Remaining Slots: {event.slots}
      </p>
    </div>
  );

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
      default:
        return 'lightgray';
    }
  };

  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState('');

  useEffect( () => {
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
      <DoctorNavbar username={username}/>
        <div style={{ display: "flex", margin: "auto", width: "100vw", justifyContent: "center" }}>
      <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: '70%' }}
          components={{
            event: CustomEvent, // Use the custom Event component
          }}
        />
    
    <div style={{ marginLeft: "30px" }}>
          <h1>My Appointments</h1>
          {latestAppointment.map((latestAppointment, index) => (
            <table key={index}>
              <tbody>
                <tr >
                  
                  <td
                      rowSpan={2}
                      width={200}
                      style={{
                        border: '3px dashed',
                        borderRadius: '10px', 
                        borderColor: getBorderColor(latestAppointment.appointmentStatus),
                        backgroundColor: getBackgroundColor(latestAppointment.appointmentStatus),
                        paddingLeft: '10px',
                        width: '300px'            
                      }}
                    >
                      {latestAppointment.title} <br />
                      {latestAppointment.clinic} <br />
                      {latestAppointment.address} <br />
                      {format(latestAppointment.start, 'MM/dd/yyyy EEEE')} <br />
                      {format(latestAppointment.start, 'h:mm a')} - {format(latestAppointment.end, 'h:mm a')} <br />
                      {latestAppointment.appointmentStatus} <br />
                    </td>
                </tr>
                <br />
                <tr >
                <td>
        Date:
        <select name="sched" id="sched"  onChange={handleRescheduleChange}>
          {generateDateOptions({ scheduleDate: latestAppointment.start })}
        </select>

      </td>
                </tr>
                <tr key={2}>
                  <td>
                    <button style={{ marginTop: "10px", borderRadius: 0, width: "100%" }} onClick={handleReschedule}>Submit</button>
                    <p>{rescheduleStatus}</p>
                    <p>{error}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}

        </div>
    
          </div>
          {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
          <DoctorFooter />
        </div>
      );
}

export default DoctorResched
