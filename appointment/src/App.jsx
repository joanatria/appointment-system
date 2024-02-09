import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PatientLogin from './pages/PatientPages/PatientLogin';
import PatientRegister from './pages/PatientPages/PatientRegister';
import DoctorLogin from './pages/DoctorPages/DoctorLogin';
import DoctorRegister from './pages/DoctorPages/DoctorRegister';
import AddClinic from './pages/AppointmentPages/AddClinic';
import AdminLogin from './pages/AdminLogin';
import PatientProfile from './pages/PatientPages/PatientProfile';
import DoctorProfile from './pages/DoctorPages/DoctorProfile';
import FAQs from './pages/FAQs';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import EditPatientProfile from './pages/PatientPages/EditPatientProfile';
import EditDoctorProfile from './pages/DoctorPages/EditDoctorProfile';
import DoctorSearch from './pages/DoctorPages/DoctorSearch';
import PatientAppointment from './pages/PatientPages/PatientAppointment';
import DoctorAppointment from './pages/DoctorPages/DoctorAppointment';
import ManageAppointments from './pages/AppointmentPages/ManageAppointments';
import PatientResched from './pages/AppointmentPages/PatientResched';
import DoctorResched from './pages/AppointmentPages/DoctorResched';
import ViewProfile from './pages/AppointmentPages/ViewProfile';
import SetAppointment from './pages/AppointmentPages/SetAppointment';
import DoctorClinics from './pages/DoctorPages/DoctorClinics';
import DoctorAddClinic from './pages/DoctorPages/DoctorAddClinic';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="patlogin" element={<PatientLogin />} />
        <Route path="patreg" element={<PatientRegister />} />
        <Route path="patprofile/:username" element={<PatientProfile />} />
        <Route path="patappointments/:username" element={<PatientAppointment />} />
        <Route path="editpatprofile/:loggedInUsername" element={<EditPatientProfile />} />
        <Route path="patresched/:username/:appointmentId" element={<PatientResched />}/>
        <Route path="setappointment/:username/:doctorId" element={<SetAppointment />}/>
        <Route path="docappointments/:username" element={<DoctorAppointment />} />
        <Route path="editdocprofile/:loggedInUsername" element={<EditDoctorProfile />} />
        <Route path="docsearch/:username" element={<DoctorSearch />} />
        <Route path="doclogin" element={<DoctorLogin />} />
        <Route path="docreg" element={<DoctorRegister />} />
        <Route path="docprofile/:username" element={<DoctorProfile />} />
        <Route path="docclinic/:username" element={<DoctorClinics />} />
        <Route path="docaddclinic/:username" element={<DoctorAddClinic />} />
        <Route path="addclinic/:doctorUserId" element={<AddClinic />} />
        <Route path="manageappointments/:username/:patientUserId" element={<ManageAppointments />} />
        <Route path="docresched/:username/:appointmentId" element={<DoctorResched />} />
        <Route path="viewprofile/:username/:patientUserId" element={<ViewProfile />} />
        <Route path="adminlog" element={<AdminLogin />} />
        <Route path="adminhome/:username" element={<AdminHome />} />
        <Route path="*" element={<PatientLogin />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;