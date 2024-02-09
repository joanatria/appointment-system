import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientNavBar from '../../components/PatientNavBar';
import PatientFooter from '../../components/PatientFooter';
import { useParams } from 'react-router-dom';
import { startOfWeek, addWeeks, addDays, format } from 'date-fns';
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../styles/Load.css";

const SetAppointment = () => {
  const {  username, doctorId } = useParams();
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSched, setSelectedSched] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [status] = useState("Scheduled by Patient");
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [patientUserId, setPatientUserId] = useState('');
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([
    {
      scheduleId: '',
      clinicId: '',
      avatar: '',
      doctorName: '',
      specialization: '',
      contactNumber: '',
      docEmail: '',
      scheduleDay: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      slots: '',
      clinicName: '',
      address: '',
      number: '',
      email: ''
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
        setPatientUserId(data);
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
            setError(error);
          });

      })
      .catch((error) => {
        setError('Error:', error);
      });

      
  }, [username]);

  const [response, setResponse] = useState('');


  const getSlots = async (selectedDate) => {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/checkSlots/${selectedSched}/${selectedDate}`);
        if (response.ok) {
          const data = await response.text();
          setResponse(data);
        }
    };

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
        window.location.reload();
      }
    } catch (error) {
      setError('Error cancelling appointment:', error);
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  };
  
  

  const handleReschedule = async (appointmentId) => {
    const appointmentToCancel = appointments.find(appointment => appointment.appointmentId === appointmentId);
  
    if (!appointmentToCancel) {
      // Handle the case where the appointment with the given ID is not found
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


  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/docsched/${doctorId}`);

        if (response.ok) {
          const data = await response.json();

          const formattedSchedules = data
          .filter(schedule => schedule.clinic.deletionStatus !== "Deleted")
          .map(schedule => ({
            scheduleId: schedule.scheduleId,
            clinicId: schedule.clinicId,
            avatar: schedule.doctor.user.avatar,
            doctorName: `Dr. ${schedule.doctor.user.firstName} ${schedule.doctor.user.middleName} ${schedule.doctor.user.lastName}`,
            specialization: schedule.doctor.specialization,
            contactNumber: schedule.doctor.user.contactNumber,
            docEmail: schedule.doctor.user.email,
            scheduleDay: schedule.scheduleDay,
            start: schedule.startTime,
            end: schedule.endTime,
            slots: schedule.slots,
            clinicName: schedule.clinic.name,
            address: schedule.clinic.address,
            number: schedule.clinic.officeNumber,
            email: schedule.clinic.officeEmail
          }));


          setSchedules(formattedSchedules);

        } else {
          setError('Error fetching appointment');
        }
      } catch (error) {
        setError('Error fetching appointment');
      }
    };

    fetchDoctorSchedules();
  }, [doctorId]);

  const convertMilitaryToStandardTime = (militaryTime) => {
    if (typeof militaryTime !== 'string' || militaryTime.length !== 8) {
      return 'Invalid Time';
    }

    const [hours, minutes] = militaryTime.split(':');
    const parsedHours = parseInt(hours, 10);
    const period = parsedHours >= 12 ? 'PM' : 'AM';
    const formattedHours = parsedHours % 12 || 12;
    return `${formattedHours}:${minutes} ${period}`;
  };



  const getNearestDays = (selectedDay, numberOfOccurrences) => {
    const today = new Date();
    const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDayIndex = daysInWeek.findIndex(day => day === selectedDay);

    if (selectedDayIndex === -1) {
      return []; // Invalid selected day
    }

    const nearestDays = Array.from({ length: numberOfOccurrences }, (_, index) => {
      const currentWeek = startOfWeek(today, { weekStartsOn: 0 }); // Always start from Sunday
      const startOfSelectedWeek = addWeeks(currentWeek, index);

      // Find the next occurrence of the selected day in the current week
      let nextDay = addDays(startOfSelectedWeek, selectedDayIndex - currentWeek.getDay());

      if (nextDay < today) {
        // If the selected day has already passed in the current week, move to the next week
        nextDay = addDays(startOfSelectedWeek, selectedDayIndex - currentWeek.getDay() + 7);
      }

      return format(nextDay, 'yyyy-MM-dd');
    });

    return nearestDays;
  };


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


  const uniqueClinics = [...new Set(schedules.map(schedule => schedule.clinicName))];


  const handleChangeClinic = (clinicName) => {
    const selectedClinic = schedules.find(schedule => schedule.clinicName === clinicName);
    setSelectedClinicId(selectedClinic?.clinicId || '');
    setSelectedDay('');
    setSelectedDate('');
    setResponse('');

  };

  useEffect(() => {
    const fetchLoggedInPatientId = async () => {
      try {
        const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/patuserid/${username}`);
        if (response.ok) {
          const userId = await response.json();
          setPatientUserId(userId);
          setIsPatientLoggedIn(true);
        } else {
          setError('Failed to fetch logged-in patient user ID.');
          setIsPatientLoggedIn(false);
        }
      } catch (error) {
        setError('Error fetching logged-in patient user ID:', error);
        setIsPatientLoggedIn(false);
        // Handle the error or provide feedback to the user
      }
    };

    fetchLoggedInPatientId();
  }, [username]); // The empty dependency array ensures that this effect runs once when the component mounts

  // Change this line

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
  const handleBookAppointment = async () => {
    try {
      setLoading(true);
      // Validate your appointment data here if needed

      const url = `https://railway-backend-production-a8c8.up.railway.app/appointment?patientId=${patientUserId}&scheduleId=${selectedSched}&scheduleDate=${selectedDate}&status=${status}`;

      const response = await fetch(url, {
        method: 'POST',
      });

      if (response.ok) {
        setError('Appointment added successfully!');
        window.location.href = `/setappointment/${username}/${doctorId}`;

        // You can handle any other logic after a successful appointment addition here
      } else {
        setError('Failed to add appointment.');
        // Handle the error or provide feedback to the user
      }
    } catch (error) {
      setError('Error adding appointment:', error);
      // Handle the error or provide feedback to the user
    } finally {
      // Set loading back to false, regardless of success or failure
      setLoading(false);
    }
  };

  const CustomEvent = ({ event }) => (
    <div style={{ margin: '5px 0', whiteSpace: 'nowrap', overflowY: 'auto', maxHeight: "55px", textOverflow: 'ellipsis' }}>
      <strong style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{event.title}</strong>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
        Clinic: {event.clinic}
      </p>
      <p style={{ margin: '0px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
        Status: {event.appointmentStatus}
      </p>
    </div>
  );


  return (
    <div>
      <PatientNavBar username={username} />
      <div style={{ display: "flex", margin: "auto", width: "90vw", justifyContent: "center",  marginTop: "2%" }}>
        <Calendar
          localizer={localizer}
          events={appointments.filter(appointment => appointment.title === schedules[0].doctorName)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: "70%" }}
          components={{
            event: CustomEvent, // Use the custom Event component
          }}
        />

        <div style={{ marginLeft: "30px", marginTop: "-10px" }}>
          <h1>{schedules[0].doctorName}</h1>
          <h2>Specialization: {schedules[0].specialization}</h2>
          <h3>Contact Number: {schedules[0].contactNumber}</h3>
          <h3>Email Address: {schedules[0].docEmail}</h3>
          <br />

          <table>
            <tr>
              <td>
                <h2 style={{ color: "#0094d4" }}>Clinic: </h2>
              </td>
              <td>
                <select
                  name="clinic"
                  id="clinic"
                  style={{
                    width: "250px",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#0094d4",
                  }}
                  onChange={(e) => handleChangeClinic(e.target.value)}
                >
                  <option value="">Select Clinic</option>
                  {uniqueClinics.map((clinicName, index) => (
                    <option key={index} value={clinicName}>
                      {clinicName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><h5>Address:</h5></td>
              <td><h5>{schedules.find(schedule => schedule.clinicId === selectedClinicId)?.address}</h5></td>
            </tr>
            <tr>
              <td><h5>Contact Number:</h5></td>
              <td><h5>{schedules.find(schedule => schedule.clinicId === selectedClinicId)?.number}</h5></td>
            </tr>
            <tr>
              <td><h5>Email Address:</h5></td>
              <td><h5>{schedules.find(schedule => schedule.clinicId === selectedClinicId)?.email}</h5></td>
            </tr>
            <tr>
              <td style={{ width: "150px" }}>Day: </td>
              <td>
                <select
                  name="sched"
                  id={`day-${selectedClinicId}`}
                  style={{ width: "250px" }}
                  value={selectedDay}
                  onChange={(e) => {
                    setSelectedDay(e.target.value);
                    setSelectedSched('');
                    setSelectedDate('');
                    setResponse('');
                  }}
                >
                  {/* Initial blank option */}
                  <option value="">Select Day</option>
                  {/* Options for the selected clinic's unique days */}
                  {[...new Set(schedules
                    .filter(schedule => schedule.clinicId === selectedClinicId)
                    .map(schedule => schedule.scheduleDay))]
                    .map(scheduleDay => (
                      <option key={`${selectedClinicId}-${scheduleDay}`} value={scheduleDay}>
                        {scheduleDay}
                      </option>
                    ))}
                </select>

              </td>
            </tr>
            <tr>
              <td style={{ width: "150px" }}>Timeslot: </td>
              <td>
                <select
                  name="timeslot"
                  id={`timeslot-${selectedClinicId}`}
                  style={{ width: "250px" }}
                  value={selectedSched}
                  onChange={(e) => {
                    const selectedTimeslot = e.target.value;
                    setSelectedDate('');
                    setSelectedSched(selectedTimeslot);
                    setResponse('');
                  }}
                >
                  {/* Initial blank option */}
                  <option value="">Select Timeslot</option>

                  {/* Options for the selected clinic's timeslots */}
                  {schedules
                    .filter(schedule => schedule.clinicId === selectedClinicId && schedule.scheduleDay === selectedDay)
                    .map(schedule => (
                      <option key={schedule.scheduleId} value={schedule.scheduleId}>
                        {convertMilitaryToStandardTime(schedule.start)} - {convertMilitaryToStandardTime(schedule.end)}
                      </option>
                    ))}
                </select>


              </td>
            </tr>

            {/* autogenerated dapat */}
            <tr>
              <td style={{ width: "150px" }}>Date: </td>
              <td>
                <select
                  name="sched"
                  id={`sched-${selectedClinicId}`}
                  style={{ width: "250px" }}
                  value={selectedDate}
                  onChange={(e) => {
                    const selectedDateString = e.target.value;
                    setSelectedDate(selectedDateString);
                    getSlots(selectedDateString);
                  }}
                >
                  {/* Initial blank option */}
                  <option value="">Select Date</option>

                  {/* Options for the selected clinic's nearest days (only 5) */}
                  {getNearestDays(selectedDay, 5).map((date, index) => (
                    <option key={index} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </option>
                  ))}
                </select>



              </td>
            </tr>
            <tr><td colSpan={2}><button style={{ marginTop: "10px", borderRadius: 0, width: "100%" }} onClick={handleBookAppointment}>Book an Appointment</button></td></tr>
            <tr><td colSpan={2} style={{ justifyContent: 'center', textAlign:'center'}}><h3><i>{response}</i></h3></td></tr>
            <tr><td colSpan={2}><h3><i>{error}</i></h3></td></tr>
          </table>

          <h1>Existing Appointments </h1>
          <div style={{ overflowY: 'auto', maxHeight: '100px' }}>
            {appointments.filter(appointment => appointment.title === schedules[0].doctorName).length > 0 ? (
              // Display appointments
              appointments.map((appointment, index) => (appointment.title === schedules[0].doctorName &&
                (
                  <table key={index}>
                    <tr>
                      <td rowSpan={2} width={200} style={{ border: '2px dashed', borderRadius: '10px',           borderColor: getBorderColor(appointment.appointmentStatus),
                        backgroundColor: getBackgroundColor(appointment.appointmentStatus),
                        paddingLeft: '10px',      }}>
                        {appointment.title} <br />
                        {appointment.clinic} <br />
                        {format(appointment.start, "MM/dd/yyyy EEEE")} <br />
                        {format(appointment.start, "h:mm a")} - {format(appointment.end, "h:mm a")}  <br />
                        {appointment.appointmentStatus} <br />
                      </td>
                      <td><button style={{ borderRadius: 5, width: "100%", minHeight: "7vh", maxHeight: "10vvh" }} onClick={() => handleReschedule(appointment.appointmentId)}>Reschedule</button></td>
                    </tr>
                    <tr>
                      <td><button className='cancel' style={{ borderRadius: 5, minHeight: "7vh", maxHeight: "10vvh"}} onClick={() => handleCancel(appointment.appointmentId)} type="submit">Cancel</button></td>
                    </tr>
                  </table>
                )
              ))
            ) : (
              // Display a message if there are no appointments with appointmentStatus === "Approved by Doctor"
              <div>
                <p>You have no existing appointments yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      <PatientFooter />
    </div>
  );
};

export default SetAppointment;
