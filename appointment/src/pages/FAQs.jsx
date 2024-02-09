import React, { useState } from 'react';
import "../styles/Faqs.css";
import FAQ from "../pages/FAQ";
import HomeNavbar from '../components/HomeNavbar';
import HomeFooter from '../components/HomeFooter';

function FAQs() {
    const [faqs, setfaqs] = useState([
        {
          question: 'How do I register on Doc Click Connect?',
          answer: 'To register, simply click on the "Register" button on the homepage. Follow the prompts to create your account. Fill in the required information and verify your account using the phone number or email address you have provided to get started.',
          open: true
        },
        {
          question: 'Is Doc Click Connect a free service?',
          answer: 'Yes, Doc Click Connect is entirely free for patients. All you need to register and access our services is a working internet connection and a valid email address.',
          open: false
        },
        {
          question: 'How can I search for doctors?',
          answer: 'Once you have successfully logged in, click on the "Search Doctors" button to input the name, specialty, clinic, or clinic schedule of the doctor you are looking for. Browse through the list of doctors that match your criteria and view their profiles to make an informed decision.',
          open: false
        },
        {
            question: 'How do I set an appointment with a doctor?',
            answer: 'Once you have found a doctor, select the preferred clinic and available day and time slot from the calendar. Click "Set Appointment" and you and your doctor will receive a notification on your email address that your appointment is confirmed.',
            open: false
        },
        {
            question: 'What if I need to cancel or reschedule an appointment?',
            answer: 'You can cancel or reschedule appointments through your account on Doc Click Connect as long as it’s more than 24 hours before the scheduled appointment. Click on the “My Appointments” button and choose any confirmed appointment that you want to reschedule or cancel.',
            open: false
        },
        {
            question: 'What if I need to cancel or reschedule an appointment within 24 hours of the appointment schedule?',
            answer: 'You can inform your doctor by contacting them on the phone number they have provided on their profile.',
            open: false
        },
        {
            question: 'What if my doctor cancels or reschedules my appointment?',
            answer: 'You will be informed through the email address you have provided, depending on the notification preference that you have set.',
            open: false
        },
        {
            question: 'Can doctors see my profile? What information can they access?',
            answer: 'Doctors can only view your profile once you have scheduled an appointment with them. Aside from your basic information and contact details, doctors can also see your health insurance information, senior citizen ID, and PWD ID if available.',
            open: false
        },
        {
            question: 'Can doctors set an appointment on my behalf?',
            answer: 'Doctors can log in to their dedicated portal, where they can manage their registered clinics and set appointments for new patients and patients for follow-up consultations.',
            open: false
        }
      ]);
    
      const toggleFAQ = index => {
        setfaqs(faqs.map((faq, i) => {
          if (i === index) {
            faq.open = !faq.open
          } else {
            faq.open = false;
          }
    
          return faq;
        }))
      }
  
    return (
      <div className="faq-container" id="container" >
        <HomeNavbar />
        <div style={{overflowY: "auto", maxHeight: "90vh",width: "100vw", margin: 0, marginBottom: "100px"}}>
          <div className="faqs" style={{marginTop: "0px", marginBottom: 0}}>
            {faqs.map((faq, i) => (
              <FAQ key={faq.question} faq={faq} index={i} toggleFAQ={toggleFAQ} />
            ))}
          </div>
        </div>
        
       <div><HomeFooter /></div>
    </div>
  );
}

export default FAQs;