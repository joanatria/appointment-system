import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import "react-big-calendar/lib/css/react-big-calendar.css";

const DoctorCalendar = () => {
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
    
    // Define your appointment data
    const appointments = [
        {
          title: "4 SLOTS",
          start: new Date(2023, 10, 6, 14, 0), // 2:00 PM
          end: new Date(2023, 10, 6, 17, 0),  // 5:00 PM
        },
    ];

  return (
    <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: "65%" }}
    />
  )
}

export default DoctorCalendar
