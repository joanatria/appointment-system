import React, { useState} from 'react';
import "../../styles/Register.css";
import { useParams } from 'react-router-dom';
import HomeNavbar from '../../components/HomeNavbar';
import HomeFooter from '../../components/HomeFooter';


const AddClinic = () => {
 const {doctorUserId} = useParams();
 const [name, setName] = useState('');
 const [address, setAddress] = useState('');
 const [officeNumber, setOfficeNumber] = useState('');
 const [officeEmail, setOfficeEmail] = useState('');
 const [hospital, setHospital] = useState('');
 const [addClinicMessage, setAddClinicMessage] = useState('');
 const [checkedDays, setCheckedDays] = useState([]);
  const handleAddClinic = async () => {
   // Check if any of the fields are empty
   if (
     !name ||
     !address ||
     !officeNumber ||
     !officeEmail
   ) {
     setAddClinicMessage('Please fill in all required fields.');
     return;
   }


   const officeNumberRegex = /^\d{11}$/;
   if (!officeNumberRegex.test(officeNumber)) {
     setAddClinicMessage('Contact number should be exactly 11 digits and contain only numbers (0-9).');
     return;
   }


   // Validate email format using regular expression
   const officeEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
   if (!officeEmailRegex.test(officeEmail)) {
     setAddClinicMessage('Invalid email format.');
     return;
   }


   try {
     const url = new URL('https://railway-backend-production-a8c8.up.railway.app/clinic');
     const userData = {
       name,
       address,
       officeNumber,
       officeEmail,
       hospital,
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
       setAddClinicMessage('Clinic added successfully');
       await handleAddSchedule();
       await handleAddSchedule1();
       window.location.href = '/doclogin';
     } else {
       // Signup failed
       const errorMessage = await response.text();
       setAddClinicMessage(errorMessage);
       setAddClinicMessage(`Signup failed`);
       // Handle the error or display an error message to the user
     }
   } catch (error) {
     console.error('Error during signup:', error);
     setAddClinicMessage('Error during signup. Please try again later.');
     // Handle the error or display an error message to the user
   }
 }
 const handleDayCheckboxChange = (day, isChecked) => {
   if (isChecked) {
     // Add the day to the list of checked days
     setCheckedDays((prevCheckedDays) => [...prevCheckedDays, day]);
   } else {
     // Remove the day from the list of checked days
     setCheckedDays((prevCheckedDays) => prevCheckedDays.filter((d) => d !== day));
   }
 };


 function convertTo24Hour(time12h, period) {
   let [hours, minutes] = time12h.split(':');
    hours = parseInt(hours, 10);
   minutes = parseInt(minutes, 10);
    if (period === 'PM' && hours !== 12) {
     hours += 12;
   } else if (period === 'AM' && hours === 12) {
     hours = 0;
   }
    const formattedHours = hours.toString().padStart(2, '0');
   const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:00`;
 }
  const handleAddSchedule = async () => {
   if (checkedDays.length === 0) {
     console.error('No days selected for schedule.');
     return;
   }
    for (const day of checkedDays) {
     try {


       const startTimeElement = document.getElementById(`${day}StartTime`);
       const startPeriodElement = document.getElementById(`${day}StartPeriod`);
       const endTimeElement = document.getElementById(`${day}EndTime`);
       const endPeriodElement = document.getElementById(`${day}EndPeriod`);
    
       if (!startTimeElement || !startPeriodElement || !endTimeElement || !endPeriodElement) {
         throw new Error(`Could not find elements for day: ${day}`);
       }
    
       const startTime = startTimeElement.value;
       const startPeriod = startPeriodElement.value;
       const endTime = endTimeElement.value;
       const endPeriod = endPeriodElement.value;
    
       const militaryStartTime = convertTo24Hour(startTime, startPeriod);
       const militaryEndTime = convertTo24Hour(endTime, endPeriod);
    
       console.log(militaryStartTime);
       console.log(militaryEndTime);
        const queryString = `name=${name}&doctorUserId=${doctorUserId}&scheduleDay=${day}&startTime=${militaryStartTime}&endTime=${militaryEndTime}&slots=${document.getElementById(`${day}Slots`).value}`;


       console.log(queryString);
       const response = await fetch(`https://railway-backend-production-a8c8.up.railway.app/schedule?${queryString}`, { method: 'POST' });

        if (response.ok) {
         console.log(`Schedule added successfully for ${day} using queryString`);
       } else {
         // Schedule addition failed for queryString
         const errorMessage = await response.text();
         console.error(`Schedule addition failed for ${day} using queryString: ${errorMessage}`);
       }
      } catch (error) {
       console.error(`Error during schedule addition for ${day}:`, error);
     }
   }
 }; 


 const handleAddSchedule1 = async () => {
   if (checkedDays.length === 0) {
     console.error('No days selected for schedule.');
     return;
   }
    for (const day of checkedDays) {
     try {


       const startTimeElement1 = document.getElementById(`${day}StartTime1`);
       const startPeriodElement1 = document.getElementById(`${day}StartPeriod1`);
       const endTimeElement1 = document.getElementById(`${day}EndTime1`);
       const endPeriodElement1 = document.getElementById(`${day}EndPeriod1`);
    
       if (!startTimeElement1 || !startPeriodElement1 || !endTimeElement1 || !endPeriodElement1) {
         console.log(`Could not find elements for day: ${day}`);
         continue; // Skip this iteration and move to the next checked day
       }
    
       const startTime1 = startTimeElement1.value;
       const startPeriod1 = startPeriodElement1.value;
       const endTime1 = endTimeElement1.value;
       const endPeriod1 = endPeriodElement1.value;
    
       const militaryStartTime1 = convertTo24Hour(startTime1, startPeriod1);
       const militaryEndTime1 = convertTo24Hour(endTime1, endPeriod1);
    
       console.log(militaryStartTime1);
       console.log(militaryEndTime1);
        const queryString1 = `name=${name}&doctorUserId=${doctorUserId}&scheduleDay=${day}&startTime=${militaryStartTime1}&endTime=${militaryEndTime1}&slots=${document.getElementById(`${day}Slots1`).value}`;


       console.log(queryString1);
       const response1 = await fetch(`https://railway-backend-production-a8c8.up.railway.app/schedule?${queryString1}`, { method: 'POST' });

        if (response1.ok) {
         // Schedule added successfully for queryString1
         console.log(`Schedule added successfully for ${day} using queryString1`);
       } else {
         // Schedule addition failed for queryString1
         const errorMessage1 = await response1.text();
         console.error(`Schedule addition failed for ${day} using queryString1: ${errorMessage1}`);
       }
      } catch (error) {
       console.error(`Error during schedule addition for ${day}:`, error);
     }
   }
 }; 


 const [showMondayTableData, setShowMondayTableData] = useState(false);
 const handleMondayCheckboxChange = (event) => {
   setShowMondayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Monday', true);
   } else {
     handleDayCheckboxChange('Monday', false);
   }
 };


 const [showTuesdayTableData, setShowTuesdayTableData] = useState(false);
 const handleTuesdayCheckboxChange = (event) => {
   setShowTuesdayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Tuesday', true);
   } else {
     handleDayCheckboxChange('Tuesday', false);
   }
 };


 const [showWednesdayTableData, setShowWednesdayTableData] = useState(false);
 const handleWednesdayCheckboxChange = (event) => {
   setShowWednesdayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Wednesday', true);
   } else {
     handleDayCheckboxChange('Wednesday', false);
   }
 };


 const [showThursdayTableData, setShowThursdayTableData] = useState(false);
 const handleThursdayCheckboxChange = (event) => {
   setShowThursdayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Thursday', true);
   } else {
     handleDayCheckboxChange('Thursday', false);
   }
 };


 const [showFridayTableData, setShowFridayTableData] = useState(false);
 const handleFridayCheckboxChange = (event) => {
   setShowFridayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Friday', true);
   } else {
     handleDayCheckboxChange('Friday', false);
   }
 };


 const [showSaturdayTableData, setShowSaturdayTableData] = useState(false);
 const handleSaturdayCheckboxChange = (event) => {
   setShowSaturdayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Saturday', true);
   } else {
     handleDayCheckboxChange('Saturday', false);
   }
 };




 const [showSundayTableData, setShowSundayTableData] = useState(false);
 const handleSundayCheckboxChange = (event) => {
   setShowSundayTableData(event.target.checked);
   if (event.target.checked) {
     handleDayCheckboxChange('Sunday', true);
   } else {
     handleDayCheckboxChange('Sunday', false);
   }
 };


 const [showMondayAddTimeSlot, setShowMondayAddTimeSlot] = useState(false);
 const handleMondayAddTimeSlotClick = () => {
   setShowMondayAddTimeSlot(!showMondayAddTimeSlot);
 };


 const [showTuesdayAddTimeSlot, setShowTuesdayAddTimeSlot] = useState(false);
 const handleTuesdayAddTimeSlotClick = () => {
   setShowTuesdayAddTimeSlot(!showTuesdayAddTimeSlot);
 };


 const [showWednesdayAddTimeSlot, setShowWednesdayAddTimeSlot] = useState(false);
 const handleWednesdayAddTimeSlotClick = () => {
   setShowWednesdayAddTimeSlot(!showWednesdayAddTimeSlot);
 };


 const [showThursdayAddTimeSlot, setShowThursdayAddTimeSlot] = useState(false);
 const handleThursdayAddTimeSlotClick = () => {
   setShowThursdayAddTimeSlot(!showThursdayAddTimeSlot);
 };


 const [showFridayAddTimeSlot, setShowFridayAddTimeSlot] = useState(false);
 const handleFridayAddTimeSlotClick = () => {
   setShowFridayAddTimeSlot(!showFridayAddTimeSlot);
 };


 const [showSaturdayAddTimeSlot, setShowSaturdayAddTimeSlot] = useState(false);
 const handleSaturdayAddTimeSlotClick = () => {
   setShowSaturdayAddTimeSlot(!showSaturdayAddTimeSlot);
 };


 const [showSundayAddTimeSlot, setShowSundayAddTimeSlot] = useState(false);
 const handleSundayAddTimeSlotClick = () => {
   setShowSundayAddTimeSlot(!showSundayAddTimeSlot);
 };


 // useEffect(() => {
 //   console.log('Checked Days:', checkedDays.join(', '));
 // }, [checkedDays]);


 return (
   <div>
   <HomeNavbar/>
   <div className="reg-container" id="reg-container">
    
     
<div className="register" style={{marginTop: "30px"}}>
       <h1 style={{ color: '#0094d4'}}>Add Clinic</h1>
       <form action="#" id="register-form" >
           <div className="reg-infield">             
               <input type="text"
                 id="name"
                 placeholder="*Clinic Name"
                 name="name"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
               />
           </div>
           <div className="reg-infield">         
               <input type="text"
                 id="address"
                 placeholder="*(House/Lot/Unit No., Street, Barangay, City/Town, Province)"
                 name="address"
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
               />
         </div>
           <div className="reg-infield">
             <input type="text"
                 id="officeNumber"
                 placeholder="*Office Number"
                 name="officeNumber"
                 value={officeNumber}
                 onChange={(e) => setOfficeNumber(e.target.value)}
               />
           </div>
           <div className="reg-infield">
             <input type="text"
                 id="officeEmail"
                 placeholder="*Office Email"
                 name="officeEmail"
                 value={officeEmail}
                 onChange={(e) => setOfficeEmail(e.target.value)}
               />
         </div>
         <div className="reg-infield">             
             <input type="text"
                 id="hospital"
                 placeholder="Hospital Affiliation"
                 name="hospital"
                 value={hospital}
                 onChange={(e) => setHospital(e.target.value)}
               />
           </div>
           <div className='reg-row'>
               <div className='reg-infield'>
                   <h4 style={{ marginBottom: '-30px' }}>Schedule: </h4>
                   <p style={{ marginBottom: '-5px' }}>Select all that applies</p>
               </div>
             </div>
             <div className='reg-row' style={{ overflowY: 'auto', maxHeight: '200px'}}>
               <div className='reg-infield'>
                 <table style={{width: "710px"}}>
                   <thead></thead>
                   <tbody>
                   <tr name='mondayRow'>
                     <td width={10}><input type='checkbox' name='mondayCheckbox' onChange={handleMondayCheckboxChange}/></td>
                     <td width={0}>Monday</td>
                     {showMondayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='MondayStartTime' placeholder='08:00' style={{paddingRight: "0px"}}/></td>
                       <td width={65}><select name="MondayStartPeriod" id="MondayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='MondayEndTime' placeholder='12:00'style={{paddingRight: "0px"}}/></td>
                       <td width={65}><select name="MondayEndPeriod" id="MondayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>                     
                       <td width={40}><input type='text' placeholder='0'  id='MondaySlots' /></td>
                       <td style={{paddingLeft: "10px", verticalAlign: "middle", width: "150px"}}><p onClick={handleMondayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showMondayTableData && showMondayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='MondayStartTime1' placeholder='08:00' style={{paddingRight: "0px"}}/></td>
                       <td width={65}><select name="MondayStartPeriod1" id="MondayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='MondayEndTime1' placeholder='12:00'style={{paddingRight: "0px"}}/></td>
                       <td width={65}><select name="MondayEndPeriod1" id="MondayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='MondaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='tuesdayRow'>
                     <td width={10}><input type='checkbox' name='tuesdayCheckbox' onChange={handleTuesdayCheckboxChange}/></td>
                     <td width={0}>Tuesday</td>
                     {showTuesdayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='TuesdayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="TuesdayStartPeriod" id="TuesdayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='TuesdayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="TuesdayEndPeriod" id="TuesdayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='TuesdaySlots' /></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px", width: "150px"}}><p onClick={handleTuesdayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showTuesdayTableData && showTuesdayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='TuesdayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="TuesdayStartPeriod1" id="TuesdayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='TuesdayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="TuesdayEndPeriod1" id="TuesdayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0'  id='TuesdaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='wednesdayRow'>
                     <td width={10}><input type='checkbox' name='wednesdayCheckbox' onChange={handleWednesdayCheckboxChange}/></td>
                     <td width={0}>Wednesday</td>
                     {showWednesdayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='WednesdayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="WednesdayStartPeriod" id="WednesdayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='WednesdayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="WednesdayEndPeriod" id="WednesdayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='WednesdaySlots' /></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px"}}><p onClick={handleWednesdayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showWednesdayTableData && showWednesdayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='WednesdayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="WednesdayStartPeriod1" id="WednesdayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='WednesdayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="WednesdayEndPeriod1" id="WednesdayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='WednesdaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='thursdayRow'>
                     <td width={10}><input type='checkbox' name='thursdayCheckbox' onChange={handleThursdayCheckboxChange}/></td>
                     <td width={0}>Thursday</td>
                     {showThursdayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='ThursdayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="ThursdayStartPeriod" id="ThursdayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='ThursdayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="ThursdayEndPeriod" id="ThursdayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='ThursdaySlots'/></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px"}}><p onClick={handleThursdayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showThursdayTableData && showThursdayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='ThursdayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="ThursdayStartPeriod1" id="ThursdayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='ThursdayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="ThursdayEndPeriod1" id="ThursdayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='ThursdaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='fridayRow'>
                     <td width={10}><input type='checkbox' name='fridayCheckbox' onChange={handleFridayCheckboxChange}/></td>
                     <td width={0}>Friday</td>
                     {showFridayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='FridayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="FridayStartPeriod" id="FridayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='FridayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="FridayEndPeriod" id="FridayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='FridaySlots' /></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px"}}><p onClick={handleFridayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showFridayTableData && showFridayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='FridayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="FridayStartPeriod1" id="FridayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='FridayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="FridayEndPeriod1" id="FridayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='FridaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='saturdayRow'>
                     <td width={10}><input type='checkbox' name='saturdayCheckbox' onChange={handleSaturdayCheckboxChange}/></td>
                     <td width={0}>Saturday</td>
                     {showSaturdayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='SaturdayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="SaturdayStartPeriod" id="SaturdayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='SaturdayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="SaturdayEndPeriod" id="SaturdayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='SaturdaySlots' /></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px"}}><p onClick={handleSaturdayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showSaturdayTableData && showSaturdayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='SaturdayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="SaturdayStartPeriod1" id="SaturdayStartPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='SaturdayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="SaturdayEndPeriod1" id="SaturdayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='SaturdaySlots1' /></td>
                   </tr>
                   </>)}
                   <tr name='sundayRow'>
                     <td width={10}><input type='checkbox' name='sundayCheckbox' onChange={handleSundayCheckboxChange}/></td>
                     <td width={0}>Sunday</td>
                     {showSundayTableData && (<>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='SundayStartTime'  placeholder='08:00'/></td>
                       <td width={65}><select name="SundayStartPeriod" id="SundayStartPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='SundayEndTime'  placeholder='12:00'/></td>
                       <td width={65}><select name="SundayEndPeriod" id="SundayEndPeriod">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                         <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                         <td width={40}><input type='text' placeholder='0' id='SundaySlots' /></td>
                         <td style={{verticalAlign: "middle", paddingLeft: "10px", paddingTop: "2px"}}><p onClick={handleSundayAddTimeSlotClick}><u>Add Time Slot</u></p></td>
                     </>)}
                   </tr>
                   {showSundayTableData && showSundayAddTimeSlot && (<>
                   <tr>
                       <td width={25}></td>
                       <td width={0}></td>
                       <td width={50}>Time: </td>
                       <td width={65}><input type="text" id='SundayStartTime1'  placeholder='08:00'/></td>
                       <td width={65}><select name="SundayStartPeriod1" id="SundayStartPeriod1">
                         <option value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={20}>to</td>
                       <td width={65}><input type="text" id='SundayEndTime1'  placeholder='12:00'/></td>
                       <td width={65}><select name="SundayEndPeriod1" id="SundayEndPeriod1">
                         <option  value="AM">AM</option>
                         <option  value="PM">PM</option>
                         </select></td>
                       <td width={60} style={{paddingBottom: "0px", paddingLeft: "5px"}}>Slots: </td>
                       <td width={40}><input type='text' placeholder='0' id='SundaySlots1' /></td>
                   </tr>
                   </>)}
                   </tbody>
                 </table>
               </div>
           </div>
       </form>
       <button type="button" onClick={handleAddClinic}>Register</button>
       <p>{addClinicMessage}</p>
     </div>
    
   </div>
   <HomeFooter/>
   </div>
 );
};


export default AddClinic;