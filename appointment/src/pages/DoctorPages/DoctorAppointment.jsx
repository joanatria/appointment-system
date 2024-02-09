import React, { useState, useEffect } from 'react';
import DoctorNavbar from '../../components/DoctorNavbar';
import DoctorFooter from '../../components/DoctorFooter';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Link, useParams } from 'react-router-dom';
import HomeFooter from '../../components/HomeFooter';
import HomeNavbar from '../../components/HomeNavbar';

const DoctorAppointment = () => {
  const { username } = useParams();
  const [appointments, setAppointments] = useState([
    {
      title: '',
      clinic: '',
      address: '',
      patientUserId: '',
      start: new Date(),
      end: new Date(),  // 5:00 PM
      appointmentId: '',
      appointmentStatus: '',
      slots: '',
      deletionStatus: '',
    },
  ]);


  useEffect(() => {
    // Replace 'https://railway-backend-production-a8c8.up.railway.app/' with your actual API URL
    fetch(`https://railway-backend-production-a8c8.up.railway.app/getDoctorUserId?username=${username}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        // Once you have the patientUserId, make another request to get appointments
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
                patientUserId: appointment.patientUserId,
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
          .catch(() => {
            // Handle errors
          });

      })
      .catch((error) => {
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




  const filterAndAggregateAppointments = (appointments) => {
    // Create an object to store unique appointments based on title
    const uniqueAppointments = {};

    // Iterate through each appointment
    appointments.forEach((appointment) => {
      const { title, patientUserId, clinic, deletionStatus } = appointment;

      // Check if the appointment is not marked as deleted
      if (deletionStatus !== "Deleted") {
        // Check if the title already exists in uniqueAppointments
        if (!uniqueAppointments[title]) {
          // If not, create an entry with an array containing the current appointment
          uniqueAppointments[title] = {
            title,
            patientUserId,
            clinics: [clinic],
          };
        } else {
          // If yes, append the clinic to the existing array
          uniqueAppointments[title].clinics.push(clinic);
        }
      }
    });

    // Convert the values of uniqueAppointments object into an array
    const resultAppointments = Object.values(uniqueAppointments);

    return resultAppointments;
  };

  const resultAppointments = filterAndAggregateAppointments(appointments);


  const handleManage = async (patientUserId) => {
    window.location.href = `/manageappointments/${username}/${patientUserId}`;
  };

  const CustomEvent = ({ event }) => {
    // Check if the event is not marked as deleted
    if (event.deletionStatus === "Deleted") {
      return null; // Skip rendering if the event is deleted
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
        {appointments.filter(appointment => appointment).length > 0 ? (
          <div style={{ marginLeft: "30px" }}>
            <h1>My Clinic</h1>
            {resultAppointments.map((appointment, index) => (
              <table key={index} style={{ borderBottom: "1px solid lightgrey" }}>
                <tr>
                  <td width={250}>{appointment.title}</td>

                </tr>
                <tr >
                  <td width={250}>

                    {Array.from(new Set(appointment.clinics)).map((clinic, clinicIndex) => (
                      <span key={clinicIndex}>{clinic}{clinicIndex !== appointment.clinics.length - 1 ? <br /> : ''}</span>
                    ))}
                  </td>

                </tr>
                <tr>
                  <td ><button style={{ borderRadius: 0, width: "260px", height: "40px" }} onClick={() => handleManage(appointment.patientUserId)}>Manage Appointments</button></td>
                </tr>
              </table>

            ))}
          </div>
        ) : (

          <div style={{ marginLeft: "1%" }}>
            <p>You have no appointments yet.</p>
          </div>
        )}
      </div>
      <DoctorFooter />
    </div>
  );
};

export default DoctorAppointment;
