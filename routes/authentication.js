const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For creating tokens
const Patient = require('../models/Patient');
const VolunteerStudent = require('../models/VolunteerStudent');
const Admin = require('../models/Admin');
const Accountant = require('../models/Accountant');
const PatientVisit = require('../models/PatientVisit');
const PatientPhysicalTherapyAssignment = require('../models/physicalTherapy/PatientPhysicalTherapyAssignment');

const Doctor = require('../models/Doctor');
const cookieParser = require('cookie-parser');
const authenticateUser = require('../authMiddleware'); // Import the middleware
const Evolution = require('../models/Evolution');
const Session = require('../models/Sessions');
const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const PendingMoney = require('../models/PatientPendingMoney');

const formidable = require("formidable");
const fs = require("fs");
const mammoth = require("mammoth");
const path = require('path');
const PatientPhysicalTherapyAssignment = require('../models/physicalTherapy/PatientPhysicalTherapyAssignment');
const PhysicalTherapyPlan = require('../models/physicalTherapy/PhysicalTherapyPlan');
const PhysicalTherapyExam = require('../models/physicalTherapy/PhysicalTherapyExam');

const DrastHalaPlan = require('../models/DrastHalaPlans');

const { v4: uuidv4 } = require('uuid');

const { body, param, validationResult } = require('express-validator');




const { ObjectId } = mongoose.Types;  // Import ObjectId from mongoose.Types

// Helper to send validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};


router.use(cookieParser());



// عرض صفحة Forgot Password
router.get("/forgot-password", (req, res) => {
  res.render("authentication/forgotPassword", { title: "Dashboard", subTitle: "SubTitle", layout: "../views/layout/layout2" });
});

// عرض صفحة تسجيل الدخول
router.get("/signin", (req, res) => {
  res.render("authentication/signin", { title: "Dashboard", subTitle: "SubTitle", layout: "../views/layout/layout2" });
});

// عرض صفحة التسجيل
router.get("/signup", (req, res) => {
  res.render("authentication/signup", { title: "Dashboard", subTitle: "SubTitle", layout: "../views/layout/layout2" });
});


// Register patient

// Register Patient Route (Backend)
router.post("/signup/patient", async (req, res) => {
  const { name, email, phone,  disabilityType, dateOfBirth, address, password, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = new Patient({
      name, email, phone, disabilityType, dateOfBirth, address, password: hashedPassword, gender
    });
    await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    console.error("Error during patient registration:", err);
    res.status(500).json({ message: 'Error registering patient' });
  }
});


// Register Volunteer
router.post("/signup/volunteer", async (req, res) => {
  const { name, email, phone, volunteerType, availableHours, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVolunteer = new VolunteerStudent({
      name, email, phone, volunteerType, availableHours, password: hashedPassword
    });

    await newVolunteer.save();
    res.status(201).json({ message: 'Volunteer registered successfully' });
  } catch (err) {
    console.error("Error during volunteer registration:", err); // Added logging
    res.status(500).json({ message: 'Error registering volunteer' });
  }
});

// Endpoint to get all patients
// Endpoint to fetch patients with pagination and search
router.get('/patients', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;  // Default page=1, limit=10

  try {
    // Search query (to find patients by name, email, or other fields)
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const patients = await Patient.find(query)
      .skip((page - 1) * limit)   // Skip patients based on page number
      .limit(limit);              // Limit number of results per page

    const totalPatients = await Patient.countDocuments(query);  // Get total count for pagination

    res.status(200).json({
      patients: patients.map(patient => ({
        ...patient.toObject(),
        disabilityType: patient.disabilityType || 'un evaluated yet',  // Handle missing disabilityType
      })),
      totalPages: Math.ceil(totalPatients / limit),  // Calculate total pages
      currentPage: page,
      totalPatients,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
});



// Register Admin
router.post("/signup/admin", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username, email, password: hashedPassword
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error("Error during admin registration:", err);
    res.status(500).json({ message: 'Error registering admin' });
  }
});





//all accountant


router.get('/accountants', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;  // Default page=1, limit=10

  try {
    // Search query (to find accountants by name, email, or other fields)
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const accountants = await Accountant.find(query)
      .skip((page - 1) * limit)   // Skip accountants based on page number
      .limit(limit);              // Limit number of results per page

    const totalaccountants = await Accountant.countDocuments(query);  // Get total count for pagination

    res.status(200).json({
      accountants: accountants.map(accountant => ({
        ...accountant.toObject(),
      })),
      totalPages: Math.ceil(totalaccountants / limit),  // Calculate total pages
      currentPage: page,
      totalaccountants,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching accountants' });
  }
});



// Register accountants
router.post("/signup/accountant", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccountant = new Accountant({
      name, email, password: hashedPassword
    });

    await newAccountant.save();
    res.status(201).json({ message: 'Accountant registered successfully' });
  } catch (err) {
    console.error("Error during Accountant registration:", err);
    res.status(500).json({ message: 'Error registering Accountant' });
  }
});



// login accountants

router.post('/signin/accountant', async (req, res) => {
  const { email, password } = req.body;
  try {
    const accountant = await Accountant.findOne({ email });
    if (!accountant) {
      return res.status(404).json({ message: 'accountant not found' });
    }
    const isMatch = await bcrypt.compare(password, accountant.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create access token
    const accessToken = jwt.sign({ id: accountant._id, role: 'accountant' }, 'accessTokenSecret', { expiresIn: '1h' });

    // Create refresh token
    const refreshToken = jwt.sign({ id: accountant._id, role: 'accountant' }, 'refreshTokenSecret', { expiresIn: '7d' });

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      sameSite: 'Strict', // Strict SameSite policy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error("Error during accountant login:", err);
    res.status(500).json({ message: 'Error logging in accountant' });
  }
});




// **Edit Accountant Information**
router.put('/edit-accountant/:id', async (req, res) => {
  const { name, email, password } = req.body;
  const accountantId = req.params.id;

  try {
    const updatedData = { name, email };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);  // If password is provided, hash it
    }

    const updatedAccountant = await Accountant.findByIdAndUpdate(accountantId, updatedData, { new: true });

    if (!updatedAccountant) {
      return res.status(404).json({ message: 'Accountant not found' });
    }

    res.status(200).json({ message: 'Accountant updated successfully', accountant: updatedAccountant });
  } catch (err) {
    res.status(500).json({ message: 'Error updating Accountant' });
  }
});

// **Delete Accountant by ID**
router.delete('/delete-accountant/:id', async (req, res) => {
  const accountantId = req.params.id;

  try {
    const deletedAccountant = await Accountant.findByIdAndDelete(accountantId);

    if (!deletedAccountant) {
      return res.status(404).json({ message: 'Accountant not found' });
    }

    res.status(200).json({ message: 'Accountant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Accountant' });
  }
});



// **Get Accountant by ID**
router.get('/accountant/:id', async (req, res) => {
  const { id } = req.params;  // Get the accountant ID from the URL

  try {
    const accountant = await Accountant.findById(id);
    if (!accountant) {
      return res.status(404).json({ message: 'Accountant not found' });
    }
    res.status(200).json(accountant); // Return the accountant data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Accountant data' });
  }
});

router.put('/accountant-password/:id', async (req, res) => {
  const { password } = req.body;
  const accountantId = req.params.id;
  try {
    const updatedaccountant = await Accountant.findById(accountantId);
    updatedaccountant.password = await bcrypt.hash(password, 10);
    await updatedaccountant.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
});




//


// Register Doctor
router.post("/signup/doctor", async (req, res) => {
  const { username, email, password, phone, title, availability } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({
      username, email, phone, password: hashedPassword, title, availability
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    console.error("Error during doctor registration:", err);
    res.status(500).json({ message: 'Error registering doctor' });
  }
});

// Admin Login Route

router.post('/signin/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create access token
    const accessToken = jwt.sign({ id: admin._id, role: 'admin' }, 'accessTokenSecret', { expiresIn: '1h' });

    // Create refresh token
    const refreshToken = jwt.sign({ id: admin._id, role: 'admin' }, 'refreshTokenSecret', { expiresIn: '7d' });

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      sameSite: 'Strict', // Strict SameSite policy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ message: 'Error logging in admin' });
  }
});

// Doctor Login Route with refresh token handling
router.post('/signin/doctor', async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create access token
    const accessToken = jwt.sign({ id: doctor._id, role: 'doctor' }, 'accessTokenSecret', { expiresIn: '1h' });

    // Create refresh token
    const refreshToken = jwt.sign({ id: doctor._id, role: 'doctor' }, 'refreshTokenSecret', { expiresIn: '7d' });

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Only accessible by the web server
      secure: process.env.NODE_ENV === 'production', // Only set cookie over HTTPS in production
      sameSite: 'Strict', // Strict SameSite policy
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error("Error during doctor login:", err);
    res.status(500).json({ message: 'Error logging in doctor' });
  }
});

// Patient Login Route with refresh token handling
router.post('/signin/patient', async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create access token
    const accessToken = jwt.sign({ id: patient._id, role: 'patient' }, 'accessTokenSecret', { expiresIn: '1h' });

    // Create refresh token
    const refreshToken = jwt.sign({ id: patient._id, role: 'patient' }, 'refreshTokenSecret', { expiresIn: '7d' });

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error("Error during patient login:", err);
    res.status(500).json({ message: 'Error logging in patient' });
  }
});

// Volunteer Login Route

// Volunteer Login Route with refresh token handling
router.post('/signin/volunteer', async (req, res) => {
  const { email, password } = req.body;
  try {
    const volunteer = await VolunteerStudent.findOne({ email });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create access token
    const accessToken = jwt.sign({ id: volunteer._id, role: 'volunteer' }, 'accessTokenSecret', { expiresIn: '1h' });

    // Create refresh token
    const refreshToken = jwt.sign({ id: volunteer._id, role: 'volunteer' }, 'refreshTokenSecret', { expiresIn: '7d' });

    // Store refresh token in an HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send the access token in the response body
    res.json({ accessToken });
  } catch (err) {
    console.error("Error during volunteer login:", err);
    res.status(500).json({ message: 'Error logging in volunteer' });
  }
});
// Edit Patient Route
router.put('/edit-patient/:id', async (req, res) => {
  const { name, email, phone, dateOfBirth, address, gender } = req.body;
  const patientId = req.params.id;  // Get the patient's ID from the URL

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(patientId, {
      name, email, phone, dateOfBirth, address, gender
    }, { new: true });  // `{ new: true }` ensures the updated document is returned

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (err) {
    res.status(500).json({ message: 'Error updating patient' });
  }
});


// Delete Patient Route
router.delete('/delete-patient/:id', async (req, res) => {
  const patientId = req.params.id;  // Get the patient's ID from the URL

  try {
    const deletedPatient = await Patient.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting patient' });
  }
});


// Get patient by ID
router.get('/patient/:id', async (req, res) => {
  const { id } = req.params;  // Get the patient ID from the URL
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);  // Return the patient data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient data' });
  }
});

router.put('/patient-password/:id', async (req, res) => {
  const { password } = req.body;
  const patientId = req.params.id;
  try {
    const updatedPatient = await Patient.findById(patientId);
    updatedPatient.password = await bcrypt.hash(password, 10);
    await updatedPatient.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.put('/doctor-password/:id', async (req, res) => {
  const { password } = req.body;
  const doctorId = req.params.id;
  try {
    const updateddoctor = await Doctor.findById(doctorId);
    updateddoctor.password = await bcrypt.hash(password, 10);
    await updateddoctor.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
});


router.put('/volunteer-password/:id', async (req, res) => {
  const { password } = req.body;
  const volunteerId = req.params.id;
  try {
    const volunteerdoctor = await VolunteerStudent.findById(volunteerId);
    volunteerdoctor.password = await bcrypt.hash(password, 10);
    await volunteerdoctor.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Route to get a specific patient's profile by ID
router.get('/view-profile/:id', async (req, res) => {
  const patientId = req.params.id;  // Get patient ID from URL parameters

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return patient data
    res.status(200).json(patient);
  } catch (err) {
    console.error('Error fetching patient data:', err);
    res.status(500).json({ message: 'Error fetching patient data' });
  }
});


// Route to get all volunteers
router.get('/volunteers', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;  // Default page=1, limit=10

  try {
    // Search query (to find volunteers by name, email, or other fields)
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const volunteers = await VolunteerStudent.find(query)
      .skip((page - 1) * limit)   // Skip volunteers based on page number
      .limit(limit);              // Limit number of results per page

    const totalVolunteers = await VolunteerStudent.countDocuments(query);  // Get total count for pagination

    res.status(200).json({
      volunteers: volunteers,
      totalPages: Math.ceil(totalVolunteers / limit),  // Calculate total pages
      currentPage: page,
      totalVolunteers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

// Route to delete a volunteer
router.delete('/delete-volunteer/:id', async (req, res) => {
  const volunteerId = req.params.id;  // Get the volunteer ID from the URL

  try {
    const deletedVolunteer = await VolunteerStudent.findByIdAndDelete(volunteerId);

    if (!deletedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting volunteer' });
  }
});



// Route to edit a volunteer
router.put('/edit-volunteer/:id', async (req, res) => {
  const { name, email, phone, volunteerType, availableHours } = req.body;
  const volunteerId = req.params.id;

  try {
    const updatedVolunteer = await VolunteerStudent.findByIdAndUpdate(volunteerId, {
      name, email, phone, volunteerType, availableHours
    }, { new: true });

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json({ message: 'Volunteer updated successfully', volunteer: updatedVolunteer });
  } catch (err) {
    res.status(500).json({ message: 'Error updating volunteer' });
  }
});

// Route to get a volunteer by ID
router.get('/volunteer/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const volunteer = await VolunteerStudent.findById(id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(volunteer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching volunteer data' });
  }
});


// **Get All Doctors (with pagination and search)**
router.get('/doctors', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;  // Default page=1, limit=10

  try {
    const query = {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    };

    const doctors = await Doctor.find(query)
      .skip((page - 1) * limit)  // Skip doctors based on page number
      .limit(limit);             // Limit number of results per page

    const totalDoctors = await Doctor.countDocuments(query); // Get total count for pagination

    res.status(200).json({
      doctors,
      totalPages: Math.ceil(totalDoctors / limit),  // Calculate total pages
      currentPage: page,
      totalDoctors,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// **Get Doctor by ID**
router.get('/doctor/:id', async (req, res) => {
  const { id } = req.params;  // Get the doctor ID from the URL

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor); // Return the doctor data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor data' });
  }
});

// **Edit Doctor Information**
router.put('/edit-doctor/:id', async (req, res) => {
  const { username, email, phone, password, title, availability } = req.body;
  const doctorId = req.params.id;

  try {
    const updatedData = { username, email, phone, title, availability };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);  // If password is provided, hash it
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updatedData, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: 'Error updating doctor' });
  }
});

// **Delete Doctor by ID**
router.delete('/delete-doctor/:id', async (req, res) => {
  const doctorId = req.params.id;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting doctor' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;  // Extract refresh token from cookies

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token missing, please log in again' });
  }

  try {
    const decoded = jwt.verify(refreshToken, 'refreshTokenSecret');  // Verify the refresh token
    let user;  // To store user details

    // Get user based on the decoded token ID and role
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id);
    } else if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id);
    } else if (decoded.role === 'volunteer') {
      user = await VolunteerStudent.findById(decoded.id);
    } else if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id);
    }

    if (!user) {
      return res.status(403).json({ message: 'User not found or invalid refresh token' });
    }

    // Create a new access token
    const accessToken = jwt.sign({ id: user._id, role: decoded.role }, 'accessTokenSecret', { expiresIn: '1h' });

    // Send the new access token
    res.json({ accessToken });
  } catch (err) {
    console.error('Error verifying refresh token:', err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});


// Get Profile Information (based on the logged-in user)
router.get('/profile', authenticateUser(['admin', 'doctor', 'volunteer', 'patient', 'accountant']), async (req, res) => {
  const userId = req.user.id;  // Get the user ID from the decoded token
  const userRole = req.user.role;  // Get the user role (admin, doctor, volunteer, or patient or accountant)

  try {
    let user;

    // Dynamically select the model based on user role
    if (userRole === 'admin') {
      user = await Admin.findById(userId);
    } else if (userRole === 'doctor') {
      user = await Doctor.findById(userId);
    } else if (userRole === 'volunteer') {
      user = await VolunteerStudent.findById(userId);
    } else if (userRole === 'patient') {
      user = await Patient.findById(userId);
    } else if (userRole === 'accountant') {
      user = await Accountant.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's data
    res.status(200).json({
      id: user._id,
      name: user.name,  // Send user's name
      role: userRole,   // Send user's role
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(403).json({ message: 'Unauthorized. Please log in again' }); // Unauthorized response
  }
});



// **Get admin by ID**
router.get('/admin/:id', async (req, res) => {
  const { id } = req.params;  // Get the admin ID from the URL
  try {
    const Admin = await Admin.findById(id);
    if (!Admin) {
      return res.status(404).json({ message: 'admin not found' });
    }
    res.status(200).json(Admin); // Return the admin data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admin data' });
  }
});







router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken'); // Clear the refresh token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});



router.get('/doctors/count', async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const joinedThisWeek = await Doctor.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    }); // Count Doctors joined this week

    res.status(200).json({
      totalDoctors,
      joinedThisWeek
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor data' });
  }
});


router.get('/volunteers/count', async (req, res) => {
  try {
    const totalVolunteers = await VolunteerStudent.countDocuments();
    const joinedThisWeek = await VolunteerStudent.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    }); // Count Volunteers joined this week

    res.status(200).json({
      totalVolunteers,
      joinedThisWeek
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching volunteer data' });
  }
});


router.get('/accountants/count', async (req, res) => {
  try {
    const totalAccountants = await Accountant.countDocuments();
    const joinedThisWeek = await Accountant.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    }); // Count Accountant joined this week

    res.status(200).json({
      totalAccountants,
      joinedThisWeek
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Accountant data' });
  }
});


router.get('/patients/count', async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const joinedThisWeek = await Patient.countDocuments({
      createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    }); // Count Patients joined this week

    res.status(200).json({
      totalPatients,
      joinedThisWeek
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient data' });
  }
});

router.post('/ev', authenticateUser(['patient']), async (req, res) => {
  try {
    console.log("Authenticated patient ID:", req.user.id);  // Log the patient ID

    const { date, time, description, type, services, school, status } = req.body;
    const patient = req.user;  // This should contain the logged-in patient's details

    if (!patient) {
      return res.status(401).json({ message: 'User not authenticated' });
    }


    const newEvolution = new Evolution({
      patient: patient.id,  // Use `patient.id` to store the _id of the patient
      description,
      date,
      time,
      type,
      services,
      school,
      status,
    });

    // Save the evolution record to the database
    const savedEvolution = await newEvolution.save();

    // Log the saved evolution data to the server console
    console.log("New evolution record saved:", savedEvolution);

    // Return the saved data to the client
    res.status(201).json(savedEvolution);
  } catch (err) {
    console.error('Error saving evaluation:', err);
    res.status(500).json({ message: 'Error saving evaluation' });
  }
});



router.get('/evaluations/stats', async (req, res) => {
  try {
    const types = [
      'free_medical_consultation',
      'school_evaluation',
      'single_session',
      'full_package_evaluation',
    ];

    // 1) get raw counts
    const agg = await Evolution.aggregate([
      { $match: { type: { $in: types } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const counts = types.reduce((o, t) => ({ ...o, [t]: 0 }), {});
    agg.forEach(({ _id, count }) => { counts[_id] = count; });
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    // 2) calculate un-rounded percentages
    const rawPcts = types.map(t => (total ? (counts[t] / total) * 100 : 0));

    // 3) round them
    const rounded = rawPcts.map(p => Math.round(p));
    let sum = rounded.reduce((a, b) => a + b, 0);

    // 4) adjust the largest slice by the rounding error
    if (sum !== 100) {
      const error = 100 - sum; // e.g. +1 or -1
      // find index of the slice with the highest raw percentage
      const idx = rawPcts.indexOf(Math.max(...rawPcts));
      rounded[idx] += error;
      sum = 100; // now it adds up correctly
    }

    // 5) map back into an object
    const percentages = types.reduce((o, t, i) => {
      o[t] = rounded[i];
      return o;
    }, {});

    // debug-log
    console.debug('Evaluation type percentages:', percentages);

    // respond
    return res.status(200).json({ counts, total });
  } catch (err) {
    console.error('Error in /evaluations/stats:', err);
    return res.status(500).json({ message: 'Error fetching evaluation stats' });
  }
});



router.get('/evaluations/:patientId', authenticateUser(['patient']), async (req, res) => {
  try {
    const patientId = req.user.id; // Patient ID from the JWT token

    // Find all evaluations for the patient
    const evaluations = await Evolution.find({ patient: patientId });

    // Check if any evaluation has "done: false"
    const hasPendingEvaluation = evaluations.some(evaluation => !evaluation.done);

    // Return the evaluations and the pending status flag
    res.status(200).json({
      evaluations,
      hasPendingEvaluation,  // This flag indicates if there's any evaluation not done
    });
  } catch (err) {
    console.error("Error fetching evaluations:", err);
    res.status(500).json({ message: "Error fetching evaluations" });
  }
});




// Backend route to fetch evaluations for a specific patient
router.get('/evv/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    // Fetch evaluations based on the patientId
    const evaluations = await Evolution.find({ patient: patientId });
    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: "No evaluations found for this patient." });
    }
    res.status(200).json({ evaluations });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    res.status(500).json({ message: "Error fetching evaluations." });
  }
});


// routes.js (or wherever you define /calendar)
router.get('/calendar', authenticateUser(['admin','patient']), async (req, res) => {
  try {
    // 1. Fetch evaluations
    const evals = await Evolution.find({})
      .populate('patient','name')
      .lean();
    const evalEvents = evals.map(ev => ({
      _id: ev._id,
      title: `Patient: ${ev.patient?.name||'Unknown'}`,
      date: ev.date,
      time: ev.time,
      type:     ev.type,           // ← the “type” field on the evaluation
      description: ev.description,
      rawTypeName: 'Evaluation',    // fallback
      typee: ev.type,

    }));

    // 2. Fetch sessions
    const sessions = await Session.find({})
      .populate({
        path: 'evaluation',
        populate: { path: 'patient', select: 'name' }
      })
      .lean();
    const sessionEvents = sessions.map(s => ({
      _id: s._id,
      title: `Patient: ${s.evaluation?.patient?.name||'Unknown'}`,
      date: s.date,
      time: s.time,
      description: s.note || '',
      rawTypeName: s.Sessionname,   // **this** comes from your model
      typee: ` ${s.evaluation?.type ||'Unknown'}`,
    }));

    // 3. Merge & sort
    const allEvents = [...evalEvents, ...sessionEvents].sort((a, b) => {
      const dA = new Date(a.date), dB = new Date(b.date);
      if (dA - dB !== 0) return dA - dB;
      return new Date(a.time) - new Date(b.time);
    });

    res.json(allEvents);
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




router.get(
  '/calendar/patient',
  authenticateUser(['patient']),
  async (req, res) => {
    try {
      const patientId = req.user.id;

      // 1) fetch this patient’s evaluations & populate sessions
      const evolutions = await Evolution.find({ patient: patientId })
        .populate('patient', 'name')
        .populate('sessions')    // needs sessions: [{ type: ObjectId, ref: 'Session' }]
        .lean();

      // 2) flatten into a single array, tagging evalType & sessionName
      const events = [];
      evolutions.forEach(ev => {
        // — evaluation record
        events.push({
          _id:          ev._id,
          title:        `Patient: ${ev.patient.name}`,
          date:         ev.date,
          time:         ev.time,
          description:  ev.description,
          evalType:     ev.type,           // ← the “type” field on the evaluation
          sessionName:  null,              // ← no session name here
        });

        // — each of its sessions
        ev.sessions.forEach(sess => {
          events.push({
            _id:          sess._id,
            title:        `Patient: ${ev.patient.name}`,
            date:         sess.date,
            time:         sess.time,
            description:  sess.note || '',
            evalType:     ev.type,           // ← still show the parent evaluation’s type
            sessionName:  sess.Sessionname,  // ← the session’s own name
          });
        });
      });

      // 3) sort by date & time
      events.sort((a, b) => {
        const da = new Date(a.date), db = new Date(b.date);
        if (da - db !== 0) return da - db;
        return new Date(a.time) - new Date(b.time);
      });

      return res.json(events);
    } catch (err) {
      console.error('Error fetching patient calendar:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);



// Add New Evaluation (for any patient selected from the dropdown)
router.post('/ev/add', authenticateUser(['admin', 'patient']), async (req, res) => {
  try {
    // Extract the necessary fields from the request body
    const { patientId, date, time, description } = req.body;

    // Check if the patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(400).json({ message: 'Patient not found' });
    }

    // Create a new Evolution record for the selected patient
    const newEvolution = new Evolution({
      patient: patientId, // Link to the selected patient
      description,
      date,
      time,
    });

    // Save the evolution record to the database
    const savedEvolution = await newEvolution.save();

    // Return the saved evolution record
    res.status(201).json(savedEvolution);
  } catch (err) {
    console.error('Error saving evaluation:', err);
    res.status(500).json({ message: 'Error saving evaluation' });
  }
});




// change patient access to doctor ?? /???? /?? /? /? ?

// Endpoint to fetch patients without evaluations
router.get('/patients-without-evaluations', authenticateUser(['admin', 'patient']), async (req, res) => {
  try {
    // Find all patients who do not have an evaluation
    const patientsWithoutEvaluations = await Patient.aggregate([
      {
        $lookup: {
          from: 'evolutions', // Reference to the Evolution model
          localField: '_id',
          foreignField: 'patient',
          as: 'evaluations',
        }
      },
      {
        $match: {
          'evaluations': { $size: 0 }, // Filter out patients who already have evaluations
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
        }
      }
    ]);

    res.status(200).json(patientsWithoutEvaluations);
  } catch (err) {
    console.error("Error fetching patients without evaluations:", err);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// Edit Evaluation
router.put('/ev/:id', authenticateUser(['admin', 'patient']), async (req, res) => {
  try {
    const { date, time, description } = req.body;
    const evaluationId = req.params.id;

    // Find and update the evaluation by ID
    const updatedEvaluation = await Evolution.findByIdAndUpdate(evaluationId, {
      date,
      time,
      description
    }, { new: true });

    if (!updatedEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json(updatedEvaluation);
  } catch (error) {
    console.error('Error updating evaluation:', error);
    res.status(500).json({ message: 'Error updating evaluation' });
  }
});



// in your routes file, below the existing /calendar
// in your routes file, after you require Evolution, Session, authenticateUser, etc.
// in your routes file



// Delete Evaluation
router.delete('/ev/:id', authenticateUser(['admin', 'patient']), async (req, res) => {
  try {
    const evaluationId = req.params.id;

    const deletedEvaluation = await Evolution.findByIdAndDelete(evaluationId);

    if (!deletedEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json({ message: 'Evaluation deleted successfully' });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    res.status(500).json({ message: 'Error deleting evaluation' });
  }
});

// Edit patient route
router.put('/doctor-editpatient/:id', async (req, res) => {
  const { service, disabilityType, evolutionNote, numberOfWeeks, sessionsPerWeek } = req.body;  // Get both service and disabilityType from the request body
  const patientId = req.params.id;  // Get the patient's ID from the URL

  try {
    // Find the patient and update both service and disabilityType
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      {
        service,         // Update the service
        disabilityType,   // Update the disabilityType
        evolutionNote,
        numberOfWeeks,
        sessionsPerWeek,
      },
      { new: true }  // `{ new: true }` ensures the updated document is returned
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Respond with the updated patient data
    res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ message: 'Error updating patient' });
  }
});



router.put('/edit-session/:id', async (req, res) => {
  const { time, date, note, price, done } = req.body;
  const sessionId = req.params.id;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Prevent changing done to false after it's been set to true
    if (session.done && done === false) {
      return res.status(400).json({ message: 'Cannot undo "done" status.' });
    }

    // Update session details
    session.time = time || session.time;
    session.date = date || session.date;
    session.note = note || session.note;
    session.price = price || session.price;
    session.done = done !== undefined ? done : session.done;

    await session.save();

    res.status(200).json({ message: 'Session updated successfully', session });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: 'Error updating session' });
  }
});




// Route to fetch all pending sessions for the logged-in user
router.get('/pending-sessions', authenticateUser(['patient']), async (req, res) => {
  const userId = req.user.id;  // Now req.user should be populated by the middleware

  try {
    // Fetch all sessions with 'pending' status for the logged-in user
    const pendingSessions = await Session.find({
      patient: userId,
      status: 'Pending',
    });

    // Check if there are any pending sessions
    if (pendingSessions.length === 0) {
      return res.status(404).json({ message: 'No pending sessions found' });
    }

    // Return the pending sessions
    res.status(200).json({ message: 'Pending sessions fetched successfully', pendingSessions });
  } catch (err) {
    console.error("Error fetching pending sessions:", err);
    res.status(500).json({ message: 'Error fetching pending sessions' });
  }
});

// Endpoint to update a specific session to completed
router.put('/edit-session-status/:id', async (req, res) => {
  const { status } = req.body; // Status field, should be 'completed'
  const sessionId = req.params.id; // sessionId from the URL parameters

  try {
    // Ensure the status is 'completed' before updating
    if (status !== 'Completed') {
      return res.status(400).json({ message: 'Invalid status, must be "completed"' });
    }

    // Use mongoose's built-in support for ObjectId parsing
    const session = await Session.findByIdAndUpdate(
      sessionId, // sessionId, Mongoose will automatically convert this if needed
      { status: 'Completed' }, // Set the status to 'completed'
      { new: true } // Return the updated session
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session marked as completed', session });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: 'Error updating session' });
  }
});



// Endpoint to mark all sessions as completed for a given patient
// Endpoint to mark all sessions as completed for a given patient
// Endpoint to mark all sessions as completed for a given patient

router.put('/mark-all-sessions-completed/:patientId', authenticateUser(['patient']), async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log("Patient ID received:", patientId); // Log the patientId to verify it

    const objectIdPatient = new mongoose.Types.ObjectId(patientId);  // Use `new` to convert to ObjectId

    // Find all sessions for this patient that are currently pending
    const result = await Session.updateMany(
      { patient: objectIdPatient, status: 'Pending' },
      { status: 'Completed' }
    );

    console.log('Update result:', result);  // Log the full result object

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No pending sessions found to update' });
    }

    res.status(200).json({ message: `${result.nModified} sessions marked as completed` });
  } catch (err) {
    console.error("Error marking sessions as completed:", err);
    res.status(500).json({ message: 'Error marking sessions as completed' });
  }
});
// Save multiple payments
router.post('/payments/bulk', authenticateUser(['patient']), async (req, res) => {
  try {
    const { payments } = req.body; // Array of payment objects

    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }

    const inserted = await Payment.insertMany(payments);

    // ✅ Log the saved records to the console
    console.log("📦 Payment records saved:");
    inserted.forEach((p, index) => {
      console.log(`${index + 1}. 
        Payment ID: ${p._id}
        Patient: ${p.patient}
        Method: ${p.method}
        Type: ${p.type}
        Price: ${p.price}
        Reference ID: ${p.referenceId}
        Note: ${p.note}
        Date: ${p.date}
      `);
    });


    res.status(201).json({ message: `${inserted.length} payments recorded`, inserted });
  } catch (err) {
    console.error("Error saving payments:", err);
    res.status(500).json({ message: 'Error saving payments' });
  }
});


router.post('/payment/per-session', authenticateUser(['patient']), async (req, res) => {
  try {
    const { sessionId } = req.body;
    const patientId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const payment = new Payment({
      patient: patientId,
      method: 'visa',
      price: session.price,
      type: 'session',
      referenceId: session._id,
      note: 'This is Pay per Session with no Discount',
    });

    await payment.save();

    console.log(`💳 Saved single payment record:
    Payment ID: ${payment._id}
    Patient: ${payment.patient}
    Method: ${payment.method}
    Type: ${payment.type}
    Price: ${payment.price}
    Reference ID: ${payment.referenceId}
    Note: ${payment.note}
    Date: ${payment.date}
    `);

    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (err) {
    console.error("Error saving per-session payment:", err);
    res.status(500).json({ message: 'Error saving per-session payment' });
  }
});


router.post('/payment/evaluation', authenticateUser(['patient']), async (req, res) => {
  try {
    const patientId = req.user.id;
    const { type } = req.body;                        // ← grab from client
    const { price } = req.body;                        // ← grab from client

    // Get the most recent evaluation by this patient
    const latestEvaluation = await Evolution.findOne({ patient: patientId }).sort({ createdAt: -1 });

    if (!latestEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found for this patient' });
    }

    const patient = await Patient.findById(patientId);

    const payment = new Payment({
      patient: patientId,
      method: 'visa',
      price: price || 0,
      type:        type || 'Undefined',              // ← use dynamic type
      referenceId: latestEvaluation._id,
      note: `This is evaluation fees for Patient: "${patient.name}"`,
      status: 'Completed',
    });

    await payment.save();

    console.log(`💳 Evaluation Payment Recorded:
    Payment ID: ${payment._id}
    Patient: ${payment.patient}
    Type: ${payment.type}
    Reference ID: ${payment.referenceId}
    Note: ${payment.note}
    Date: ${payment.date}
    Price: ${payment.price}
    status: ${payment.status}

    `);

    res.status(201).json({ message: 'Evaluation payment saved', payment });
  } catch (err) {
    console.error("Error saving evaluation payment:", err);
    res.status(500).json({ message: 'Error saving evaluation payment' });
  }
});



router.post('/payment/cash', authenticateUser(['patient']), async (req, res) => {
  try {
    const patientId = req.user.id;
    const { type } = req.body;                        // ← grab from client
    const { price } = req.body;                        // ← grab from client

    const latestEvaluation = await Evolution
      .findOne({ patient: patientId })
      .sort({ createdAt: -1 });
    if (!latestEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found for this patient' });
    }

    const patient = await Patient.findById(patientId);

    const payment = new Payment({
      patient:     patientId,
      method:      'cash',
      price:       price || 0 ,
     type:        type || 'Undefined',              // ← use dynamic type
      referenceId: latestEvaluation._id,
      note:        `This is evaluation fees for Patient: "${patient.name}"`,
      status:      'Cash',
    });
    await payment.save();

    console.log(`💳 Evaluation Payment Recorded:
    Payment ID: ${payment._id}
    Patient: ${payment.patient}
    Type: ${payment.type}
    Reference ID: ${payment.referenceId}
    Note: ${payment.note}
    Date: ${payment.date}
    Price: ${payment.price}
    status: ${payment.status}

    `);


    const now = new Date();
    const pending = new PendingMoney({
      patient: patientId,
      Payment: payment._id,
      date:    now,
      time:    now.toTimeString().split(' ')[0], // "HH:MM:SS"
      price:   payment.price,
    });
    await pending.save();

    // <-- log every field of the saved pending record
    console.log('✅ PatientPendingMoney saved:', {
      _id:      pending._id,
      patient:  pending.patient,
      payment:  pending.Payment,
      date:     pending.date.toISOString(),
      time:     pending.time,
      price:    pending.price,
      createdAt: pending.createdAt.toISOString(),
      updatedAt: pending.updatedAt.toISOString()
    });

    res.status(201).json({
      message:      'Evaluation payment and pending record saved',
      payment,
      pendingMoney: pending
    });
  } catch (err) {
    console.error("Error saving evaluation payment or pending record:", err);
    res.status(500).json({ message: 'Error processing payment' });
  }
});


router.get('/payments', authenticateUser(['admin', 'accountant', 'patient']), async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('patient', 'name') // just get patient name
      .sort({ date: -1 }); // recent first

    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('patient');
    if (!payment) return res.status(404).send('Not found');
    res.json(payment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update one
router.put('/payments/:id', async (req, res) => {
  try {
    const { date, price, note } = req.body;
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { date, price, note },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.delete('/payments/:id', async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});



// one to many new evulation

// Route to create an evaluation and its sessions
router.post('/create-evaluation', authenticateUser(['doctor']), async (req, res) => {
  const { patientId, description, date, time, weeks, sessionsPerWeek, price } = req.body;

  try {
    // Create new evaluation
    const newEvaluation = new Evolution({
      patient: patientId,
      description,
      date,
      time,
      done: false,
    });

    const savedEvaluation = await newEvaluation.save();

    // Create sessions based on weeks and sessions per week
    let sessionName = 1;
    for (let i = 0; i < weeks * sessionsPerWeek; i++) {
      const newSession = new Session({
        evaluation: savedEvaluation._id,
        patient: patientId,
        date: calculateSessionDate(i), // Assuming you have logic for date calculation
        time,
        price,
        name: `Session ${sessionName}`,
      });

      const savedSession = await newSession.save();
      savedEvaluation.sessions.push(savedSession._id);  // Add session reference to evaluation

      sessionName++;
    }

    // Save the evaluation with session references
    await savedEvaluation.save();

    res.status(201).json(savedEvaluation);
  } catch (err) {
    console.error('Error creating evaluation and sessions:', err);
    res.status(500).json({ message: 'Error creating evaluation and sessions' });
  }
});

// Route to fetch evaluations for a specific patient
router.get('/allevaluations/:patientId', async (req, res) => {
  const { patientId } = req.params;  // Extract the patientId from the URL

  try {
    // Find all evaluations for the given patientId
    const evaluations = await Evolution.find({ patient: patientId }).populate('sessions');
    res.status(200).json(evaluations);  // Return the list of evaluations
  } catch (err) {
    res.status(500).json({ message: 'Error fetching evaluations' });
  }
});
router.get('/allevaluations', async (req, res) => {
  const { search } = req.query;  // only search remains

  try {
    const query = {};
    if (search) {
      query['patient.name'] = { $regex: search, $options: 'i' };
    }

    // No status filtering at all—return everything matching search
    const evaluations = await Evolution.find(query)
      .populate('patient', 'name phone')
      .exec();

    res.status(200).json({ evaluations });
  } catch (err) {
    console.error("Error fetching all evaluations:", err);
    res.status(500).json({ message: 'Error fetching evaluations' });
  }
});




// Create or update evaluation
router.put('/sdnevaluation/:id', async (req, res) => {
  const { id } = req.params;
  const { patientDescription, service, evolutionNote, date, time } = req.body;

  try {
    // Step 1: Update the evaluation record with provided data
    const evaluation = await Evolution.findByIdAndUpdate(id, {
      service,
      evolutionNote,
      date,
      time,
      patientdescription: patientDescription, // Save the description in the evaluation model
    }, { new: true });

    // Step 2: If evaluation exists, proceed to update the patient description
    if (evaluation) {
      const patientId = evaluation.patient; // Get patientId from evaluation document

      // Step 3: Find the patient by patientId
      const patient = await Patient.findById(patientId);
      if (patient) {
        // Step 4: Log the patient name and the new description
        console.log(`Updating patient description for ${patient.name}: ${patientDescription}`);

        // Step 5: Update the patient's description
        patient.mydescription = patientDescription; // Update the description
        await patient.save(); // Save the updated patient

        // Debug log to confirm the update
        console.log(`Updated description for patient ${patient.name} to: ${patient.mydescription}`);
      } else {
        console.log("Patient not found!");
      }
    } else {
      console.log("Evaluation not found!");
    }

    // Return the updated evaluation
    res.status(200).json(evaluation);
  } catch (err) {
    console.error("Error updating evaluation:", err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});


router.post('/create-session', async (req, res) => {
  const { evaluation, Sessionname, date, time, price } = req.body;

  try {
    // Ensure the Evolution ID is valid and converted to ObjectId
    const evaluationId = new mongoose.Types.ObjectId(evaluation);

    // Ensure price is a number
    const sessionPrice = Number(price);

    // Create a new session instance
    const newSession = new Session({
      evaluation: evaluationId,
      Sessionname,
      date,
      time,
      price: sessionPrice,
    });

    // Save the session
    const savedSession = await newSession.save();

    // Add the session reference to the Evolution document,
    // pushing the new ID into the sessions array and keeping it sorted
    const updatedEvolution = await Evolution.findByIdAndUpdate(
      evaluationId,
      {
        $push: {
          sessions: {
            $each: [ savedSession._id ],
            $sort: 1        // newest-first if you prefer
          }
        },
        // Update the latestSessionDate with the current session's date
        latestSessionDate: date
      },
      { new: true }
    );

    // Log the update of the Evolution document
    console.log(
      `✔️ Evolution ${evaluationId} updated. Sessions list now contains ${updatedEvolution.sessions.length} entries:`,
      updatedEvolution.sessions
    );

    // Send the saved session as a response
    res.status(201).json(savedSession);
    console.log("Successfully created session:", savedSession);  // Log the saved session

  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ message: 'Error creating session' });
  }
});

// Get a specific evaluation by ID
router.get('/evaluation/:id', async (req, res) => {
  const { id } = req.params;  // Extract the evaluation ID from the URL

  try {
    // Find the evaluation by its ID and populate associated sessions if needed
    const evaluation = await Evolution.findById(id).populate('sessions');

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" });
    }

    res.status(200).json(evaluation);  // Send the evaluation data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching evaluation' });
  }
});

// Update evaluation status to 'done'
// after importing PatientVisit, Evolution, Patient…
// routes/yourRoutes.js
router.put('/done-evaluation/:id', authenticateUser(['patient', 'doctor']), async (req, res) => {
  try {
    const evaluationId = req.params.id;
    const { done, doctor } = req.body;           // grab doctor from the body
    const user = req.user;

    const updateData = { done };
    if (user.role === 'doctor' && done) {
      updateData.doctor = doctor;   
    }

    const updatedEvaluation = await Evolution.findByIdAndUpdate(
      evaluationId,
      updateData,
      { new: true }
    );

    if (!updatedEvaluation) return res.status(404).json({ message: 'Evaluation not found' });
    console.log('User info:', user);
    console.log('Marking done:', done);
    if (updatedEvaluation.doctor) {
      console.log(`🩺 Doctor ID ${updatedEvaluation.doctor} saved in evaluation ${updatedEvaluation._id}`);
    } else {
      console.log(`⚠️ No doctor ID saved in evaluation ${updatedEvaluation._id}`);
    }

    if (updatedEvaluation.done) {
      const patient = await Patient.findById(updatedEvaluation.patient).select('lastvisit name gender');

      const visit = await PatientVisit.create({
        patient: updatedEvaluation.patient,
        evaluation: updatedEvaluation._id,
        date: updatedEvaluation.date,
        time: updatedEvaluation.time,
        gender: patient.gender,
      });
      console.log('✅ PatientVisit (evaluation) created:', visit);

      await Patient.findByIdAndUpdate(
        updatedEvaluation.patient,
        { lastvisit: visit.date }
      );
      console.log(`🔄 Patient.lastvisit updated for patient: ${patient.name}, lastvisit: ${patient.lastvisit ? patient.lastvisit.toISOString() : 'N/A'}`);
    }

    res.status(200).json(updatedEvaluation);
  } catch (error) {
    console.error("Error in done-evaluation:", error);
    res.status(500).json({ message: "Error updating evaluation status" });
  }
});


router.put('/done-session/:id', authenticateUser(['patient', 'doctor']), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { done, doctor } = req.body;           // grab doctor from the body
    const user = req.user;

    const updateData = { done };
    if (user.role === 'doctor' && done) {
      updateData.doctor = doctor;   
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true }
    );

    if (!updatedSession) return res.status(404).json({ message: 'Session not found' });

    if (updatedSession.doctor) {
      console.log(`🩺 Doctor ID ${updatedSession.doctor} saved in session ${updatedSession._id}`);
    } else {
      console.log(`⚠️ No doctor ID saved in session ${updatedSession._id}`);
    }

    if (updatedSession.done) {
      const evalDoc = await Evolution.findById(updatedSession.evaluation).select('patient');
      const patient = await Patient.findById(evalDoc.patient).select('lastvisit name gender');

      const visit = await PatientVisit.create({
        patient: evalDoc.patient,
        session: updatedSession._id,
        date: updatedSession.date,
        time: updatedSession.time,
        gender: patient.gender,
      });
      console.log('✅ PatientVisit (session) created:', visit);

      await Patient.findByIdAndUpdate(
        evalDoc.patient,
        { lastvisit: visit.date }
      );
      console.log(`🔄 Patient.lastvisit updated for patient: ${patient.name}, lastvisit: ${patient.lastvisit ? patient.lastvisit.toISOString() : 'N/A'}`);
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error in done-session:", error);
    res.status(500).json({ message: "Error updating session status" });
  }
});




router.get(
  '/latest-appointments',
  authenticateUser(['patient','doctor']),
  async (req, res) => {
    try {
      // Fetch done evaluations, populate patient name and doctor username
      const evals = await Evolution.find({ done: true })
        .populate({
          path: 'patient',
          select: 'name'
        })
        .populate({
          path: 'doctor',
          model: 'Doctor',
          select: 'username'
        })
        .select('patient type date time doctor')
        .lean()

      // Fetch done sessions, populate evaluation, patient, and doctor on evaluation and session
      const sessions = await Session.find({ done: true })
        .populate({
          path: 'evaluation',
          select: 'patient type doctor',
          populate: [
            {
              path: 'patient',
              select: 'name'
            },
            {
              path: 'doctor',
              model: 'Doctor',
              select: 'username'
            }
          ]
        })
        .populate({
          path: 'doctor',   // Also populate doctor directly on session if you want
          model: 'Doctor',
          select: 'username'
        })
        .select('Sessionname date time evaluation doctor')
        .lean()

      const items = []

      evals.forEach(ev => {
        if (!ev.patient) return
        items.push({
          id: ev._id,
          studentName: ev.patient.name,
          itemName: 'Evaluation',
          programType: ev.type,
          date: ev.date,
          time: ev.time,
          status: 'Completed',
          doctor: ev.doctor?.username
        })
      })

      sessions.forEach(s => {
        const e = s.evaluation
        if (!e || !e.patient) return
        items.push({
          id: s._id,
          studentName: e.patient.name,
          itemName: s.Sessionname,
          programType: e.type,
          date: s.date,
          time: s.time,
          status: 'Completed',
          // Use doctor from session if present, else fall back to evaluation doctor
          doctor: s.doctor?.username 
        })
      })

      items.sort((a, b) => new Date(b.date) - new Date(a.date))
      return res.json(items.slice(0, 6))
    } catch (err) {
      console.error('Error loading latest appointments:', err)
      return res.status(500).json({ message: 'Could not load latest appointments' })
    }
  }
)


// Get all sessions for a specific evaluation
router.get('/sessions/:evaluationId', async (req, res) => {
  const evaluationId = req.params.evaluationId;

  try {
    const sessions = await Session.find({ evaluation: evaluationId });
    res.status(200).json(sessions);  // Send the list of sessions
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: 'Error fetching session data' });
  }
});



router.put('/edit-session/:id', async (req, res) => {
  const { time, date, price } = req.body;
  const sessionId = req.params.id;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Prevent changing "done" status if it's already marked as done
    if (session.done && req.body.done === false) {
      return res.status(400).json({ message: 'Cannot undo "done" status.' });
    }

    // Update session fields
    session.time = time || session.time;
    session.date = date || session.date;
    session.price = price || session.price;

    await session.save();

    res.status(200).json({ message: 'Session updated successfully', session });
  } catch (err) {
    console.error("Error updating session:", err);
    res.status(500).json({ message: 'Error updating session' });
  }
});

// Route to fetch free medical consultation evaluations with Pending status
router.get('/allevaluations-free', async (req, res) => {
  const { search, page = 1, limit = 10, type } = req.query; // Default page to 1, limit to 10 if not provided

  try {
    const query = {};

    // Filter by type (free_medical_consultation) and status (Pending)
    if (type) {
      query['type'] = type; // Filter by type
    }
    
    // Filter by status = 'Pending'
    query['status'] = 'Pending';

    // If search keyword exists, filter by patient name (optional)
    if (search) {
      query['patient.name'] = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    // Paginate using page and limit
    const evaluations = await Evolution.find(query)
      .populate('patient', 'name phone')  // Populate the patient fields (name, phone)
      .skip((Number(page) - 1) * Number(limit))     // Ensure page and limit are treated as numbers
      .limit(Number(limit))         // Limit the number of results per page
      .exec();

    // Get total count of evaluations for pagination
    const totalEvaluations = await Evolution.countDocuments(query);

    res.status(200).json({
      evaluations,
      totalPages: Math.ceil(totalEvaluations / Number(limit)), // Ensure limit is treated as number
    });
  } catch (err) {
    console.error("Error fetching all evaluations:", err);
    res.status(500).json({ message: 'Error fetching evaluations' });
  }
});



// Accept Consultation (Only update the status to 'Completed')
router.post('/acceptConsultation/:id', async (req, res) => {
  const { id } = req.params; // Get the evaluation ID from the URL

  try {
    // Fetch the current evaluation to log before the update
    const currentEvaluation = await Evolution.findById(id);
    
    if (!currentEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Log the current (before) evaluation data
    console.debug("Before Accept Consultation:", currentEvaluation);

    // Update only the status to 'Completed'
    const updatedEvaluation = await Evolution.findByIdAndUpdate(id, {
      status: 'Completed', // Change status to 'Completed'
    }, { new: true }); // Return the updated document

    // Log the updated (after) evaluation data
    console.debug("After Accept Consultation:", updatedEvaluation);

    res.status(200).json(updatedEvaluation);
  } catch (err) {
    console.error("Error accepting consultation:", err);
    res.status(500).json({ message: 'Error accepting consultation' });
  }
});

// Decline Consultation (Mark as Declined)
router.post('/declineConsultation/:id', async (req, res) => {
  const { id } = req.params; // Get the evaluation ID from the URL

  try {
    // Fetch the current evaluation to log before the update
    const currentEvaluation = await Evolution.findById(id);
    
    if (!currentEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Log the current (before) evaluation data
    console.debug("Before Decline Consultation:", currentEvaluation);

    // Update the evaluation to mark it as "Declined"
    const updatedEvaluation = await Evolution.findByIdAndUpdate(id, {
      status: 'Declined', // Change status to 'Declined'
    }, { new: true }); // Return the updated document

    // Log the updated (after) evaluation data
    console.debug("After Decline Consultation:", updatedEvaluation);

    res.status(200).json(updatedEvaluation);
  } catch (err) {
    console.error("Error declining consultation:", err);
    res.status(500).json({ message: 'Error declining consultation' });
  }
});

// Edit Consultation (Update Date and Time)
router.post('/editConsultation/:id', async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body; // New date and time values

  try {
    // Fetch the current evaluation to log before the update
    const currentEvaluation = await Evolution.findById(id);
    
    if (!currentEvaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    // Log the current (before) evaluation data
    console.debug("Before Edit Consultation:", currentEvaluation);

    // Update the evaluation's date and time
    const updatedEvaluation = await Evolution.findByIdAndUpdate(id, {
      date,
      time,
    }, { new: true }); // Return the updated document

    // Log the updated (after) evaluation data
    console.debug("After Edit Consultation:", updatedEvaluation);

    res.status(200).json(updatedEvaluation);
  } catch (err) {
    console.error("Error updating consultation:", err);
    res.status(500).json({ message: 'Error updating consultation' });
  }
});



// Route to get pending money for a specific patient
router.get('/patient-pending-money/:patientId', async (req, res) => {
  const patientId = req.params.patientId;  // Extract the patient ID from the URL parameter

  try {
    // Find all pending money records for the given patient
    const pendingMoneyRecords = await PendingMoney.find({ patient: patientId }).exec();

    if (!pendingMoneyRecords || pendingMoneyRecords.length === 0) {
      // If no records are found, return an empty array with a success status
      return res.status(200).json([]);
    }

    // If records are found, return them
    res.status(200).json(pendingMoneyRecords);
  } catch (err) {
    console.error('Error fetching pending money records:', err);
    res.status(500).json({ message: 'Error fetching pending money records' });
  }
});

// Route to fetch sessions for a specific evaluation
router.get('/evaluation-sessions/:evaluationId', async (req, res) => {
  const { evaluationId } = req.params; // Get the evaluation ID from the URL

  try {
    // Check if the evaluation exists
    const evaluation = await Evolution.findById(evaluationId);
    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found." });
    }

    // If evaluation exists, check the sessions list
    const sessions = await Session.find({ '_id': { $in: evaluation.sessions } });

    if (sessions.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(sessions); // Send the sessions data
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Error fetching sessions." });
  }
});

// … after you require Evolution and before module.exports = router


router.get('/patient-visits', async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).send("Missing from/to query parameters");
  try {
    const visits = await PatientVisit.find({
      date: { $gte: new Date(from), $lte: new Date(to) }
    });
    res.json(visits);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


// In your routes file (e.g., routes/api.js or wherever you want)

// Helper to get start and end of current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
};

router.get('/income-summary', async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();

    // Sum price for Payments in this month
    const netIncomeAggregation = await Payment.aggregate([
      { $match: { date: { $gte: start, $lt: end }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const netIncome = netIncomeAggregation[0]?.total || 0;

    // Sum price for PatientPendingMoney in this month
    const pendingMoneyAggregation = await PendingMoney.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const pendingMoney = pendingMoneyAggregation[0]?.total || 0;

    res.json({
      netIncome,
      pendingMoney,
      totalIncome: netIncome + pendingMoney,
    });
  } catch (error) {
    console.error("Error fetching income summary:", error);
    res.status(500).json({ message: "Server error fetching income summary" });
  }
});



// … way down at the bottom of authentication.cjs (or .js if you switched to commonjs)
// Helper to get start/end of period:
function getPeriodRange(period) {
  const now = new Date();
  if (period === 'week')   return { start: new Date(now - 7*86400000), end: now };
  if (period === 'year')   return { start: new Date(now.getFullYear(),0,1),   end: now };
  /* default: month */     return { start: new Date(now.getFullYear(),now.getMonth(),1), end: now };
}

// Your new trend endpoint:
router.get('/income-trend', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { start, end }   = getPeriodRange(period);
    const days              = Math.ceil((end - start)/86400000);
    const labels   = [], paidSeries = [], pendingSeries = [];

    for (let i = 0; i <= days; i++) {
      const dayStart = new Date(start.getTime() + i*86400000);
      dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(dayStart); dayEnd.setHours(23,59,59,999);
      labels.push(dayStart.toLocaleDateString('en-US',{month:'short',day:'numeric'}));

      const paidAgg = await Payment.aggregate([
        { $match: { date: { $gte: dayStart, $lte: dayEnd }, status: 'Completed' } },
        { $group: { _id:null, total:{$sum:'$price'} } }
      ]);
      paidSeries.push(paidAgg[0]?.total || 0);

      const pendAgg = await PendingMoney.aggregate([
        { $match: { date: { $gte: dayStart, $lte: dayEnd } } },
        { $group: { _id:null, total:{$sum:'$price'} } }
      ]);
      pendingSeries.push(pendAgg[0]?.total || 0);
    }

    res.json({
      labels,
      paidSeries,
      pendingSeries,
      totalPaid:    paidSeries.reduce((a,b)=>a+b,0),
      totalPending: pendingSeries.reduce((a,b)=>a+b,0),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
});






// Add Physical Therapy Assignment
router.post('/assign-to-physical', async (req, res) => {
  const { patientId, notes } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: 'Invalid or missing patient ID' });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Ensure the patient is not already assigned to physical therapy
    const existingAssignment = await PatientPhysicalTherapyAssignment.findOne({
      patient: patientId,
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Patient already assigned to physical therapy' });
    }

    const assignment = new PatientPhysicalTherapyAssignment({
      patient: patientId,
      notes: notes || '',
      status: 'active',
    });

    await assignment.save();

    res.status(201).json({ message: 'Patient assigned to physical therapy successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning patient to physical therapy', error: err.message });
  }
});

// Get Physical Therapy Assignments
router.get('/physical-therapy-assignments', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const query = {};
    if (search) {
      const patients = await Patient.find({
        name: { $regex: search, $options: 'i' },
      }).select('_id');

      if (patients.length > 0) {
        query.patient = { $in: patients.map((p) => p._id) };
      } else {
        return res.status(200).json({
          assignments: [],
          totalPages: 0,
          currentPage: Number.parseInt(page),
          totalAssignments: 0,
        });
      }
    }

    const assignments = await PatientPhysicalTherapyAssignment.find(query)
      .populate({
        path: 'patient',
        select: 'name email phone disabilityType',
        model: 'Patient',
      })
      .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
      .limit(Number.parseInt(limit))
      .sort({ assignedDate: -1 });

    const totalAssignments = await PatientPhysicalTherapyAssignment.countDocuments(query);

    res.status(200).json({
      assignments,
      totalPages: Math.ceil(totalAssignments / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      totalAssignments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching physical therapy assignments' });
  }
});

// Unassign from Physical Therapy
router.delete('/unassign-from-physical/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const assignment = await PatientPhysicalTherapyAssignment.findOneAndDelete({ patient: patientId });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Patient unassigned from physical therapy' });
  } catch (err) {
    res.status(500).json({ message: 'Error unassigning patient' });
  }
});

// routes/physical-therapy.js (continued)

// Get Physical Therapy Plan for a patient
router.get('/physical-therapy/plan/:patientId', async (req, res) => {
  const { patientId } = req.params

  try {
    const plan = await PhysicalTherapyPlan.findOne({ patient: patientId }).sort({ lastModified: -1 })
    if (!plan) {
      return res.status(404).json({ message: 'No plan found for this patient' })
    }
    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Physical Therapy plan' })
  }
})

// Create Physical Therapy Plan
router.post('/physical-therapy/plan', async (req, res) => {
  const { patient, title, content, createdBy } = req.body

  try {
    const plan = new PhysicalTherapyPlan({
      patient,
      title,
      content,
      createdBy: createdBy || 'System',
      lastModified: new Date(),
    })

    await plan.save()

    res.status(201).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error creating Physical Therapy plan' })
  }
})

// Update Physical Therapy Plan
router.put('/physical-therapy/plan/:planId', async (req, res) => {
  const { planId } = req.params
  const { title, content, createdBy } = req.body

  try {
    const plan = await PhysicalTherapyPlan.findByIdAndUpdate(
      planId,
      { title, content, createdBy: createdBy || 'System', lastModified: new Date() },
      { new: true }
    )

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }

    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error updating Physical Therapy plan' })
  }
})

// routes/physical-therapy.js (continued)

// Get Physical Therapy Exam for a patient
// Get Physical Therapy Exam for a patient
router.get('/physical-therapy/exam/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const exam = await PhysicalTherapyExam.findOne({ patient: patientId }).sort({ lastModified: -1 });

    if (!exam) {
      return res.status(404).json({ message: 'No exam found for this patient' });
    }
    res.status(200).json(exam); // Return exam document if it exists
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Physical Therapy exam' });
  }
});

// Create Physical Therapy Exam
router.post('/physical-therapy/exam', async (req, res) => {
  const { patient, title, content, score, createdBy } = req.body

  try {
    const exam = new PhysicalTherapyExam({
      patient,
      title,
      content,
      score: score || 0,
      examDate: new Date(),
      createdBy: createdBy || 'System',
      lastModified: new Date(),
    })

    await exam.save()

    res.status(201).json(exam)
  } catch (err) {
    res.status(500).json({ message: 'Error creating Physical Therapy exam' })
  }
})

// Update Physical Therapy Exam
router.put('/physical-therapy/exam/:examId', async (req, res) => {
  const { examId } = req.params
  const { title, content, score, createdBy } = req.body

  try {
    const exam = await PhysicalTherapyExam.findByIdAndUpdate(
      examId,
      { title, content, score: score || 0, createdBy: createdBy || 'System', lastModified: new Date() },
      { new: true }
    )

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }

    res.status(200).json(exam)
  } catch (err) {
    res.status(500).json({ message: 'Error updating Physical Therapy exam' })
  }
})

router.post("/py/upload-plan", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/physical-therapy/plan");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  form.uploadDir = uploadDir;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error parsing uploaded file" });
    }

    // Ensure that patientId is not an array and is a valid string
    const patientId = fields.patientId && fields.patientId[0] ? fields.patientId[0] : null; // Extract the value from array if present

    if (!patientId) {
      console.log("Patient ID is missing!");
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Log the patientId to verify it's received correctly
    console.log("Patient ID from backend:", patientId);

    const file = files.document[0];
    const tempFilePath = file.filepath;
    const originalFileName = file.originalFilename;

    const uniqueFileName = `${uuidv4()}${path.extname(originalFileName)}`;
    const finalFilePath = path.join(uploadDir, uniqueFileName);

    fs.renameSync(tempFilePath, finalFilePath);

    try {
      // Now link the file to the patient in your database (PhysicalTherapyPlan)
      const plan = await PhysicalTherapyPlan.findOneAndUpdate(
        { patient: patientId }, // Find the plan by patientId
        {
          filePath: uniqueFileName,
          fileName: originalFileName,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
        },
        { new: true, upsert: true } // Update or create the plan
      );

      // Log the uploaded plan record to the console
      console.log("Uploaded Plan Record:", plan);

      // Send the response back to the client
      res.status(200).json({
        title: originalFileName.replace(/\.[^/.]+$/, ""),
        fileName: originalFileName,
        filePath: uniqueFileName,
        message: "Plan document uploaded and linked successfully!",
      });
    } catch (error) {
      console.error("Error linking document to plan:", error);
      res.status(500).json({ message: "Error linking document to plan" });
    }
  });
});

// Upload physical therapy exam document and link to patient
// Upload physical therapy exam document and link to patient
router.post("/py/upload-test", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/physical-therapy/exam");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  form.uploadDir = uploadDir;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error parsing uploaded file" });
    }

    // Ensure that patientId is not an array and is a valid string
    const patientId = fields.patientId && fields.patientId[0] ? fields.patientId[0] : null; // Extract the value from array if present

    if (!patientId) {
      console.log("Patient ID is missing!");
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Log the patientId to verify it's received correctly
    console.log("Patient ID from backend:", patientId);

    const file = files.document[0];
    const tempFilePath = file.filepath;
    const originalFileName = file.originalFilename;

    const uniqueFileName = `${uuidv4()}${path.extname(originalFileName)}`;
    const finalFilePath = path.join(uploadDir, uniqueFileName);

    fs.renameSync(tempFilePath, finalFilePath);

    try {
      // Now link the file to the patient in your database (PhysicalTherapyExam)
      const Exam = await PhysicalTherapyExam.findOneAndUpdate(
        { patient: patientId }, // Find the Exam by patientId
        {
          filePath: uniqueFileName,
          fileName: originalFileName,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
        },
        { new: true, upsert: true } // Update or create the Exam
      );

      // Log the uploaded Exam record to the console
      console.log("Uploaded Exam Record:", Exam);

      // Send the response back to the client
      res.status(200).json({
        title: originalFileName.replace(/\.[^/.]+$/, ""),
        fileName: originalFileName,
        filePath: uniqueFileName,
        message: "Exam document uploaded and linked successfully!",
      });
    } catch (error) {
      console.error("Error linking document to Exam:", error);
      res.status(500).json({ message: "Error linking document to Exam" });
    }
  });
});







// DRAST EL7ALA

router.get('/DRAST-7ALA/plan/:patientId', async (req, res) => {
  const { patientId } = req.params

  try {
    const plan = await DrastHalaPlan.findOne({ patient: patientId }).sort({ lastModified: -1 })
    if (!plan) {
      return res.status(404).json({ message: 'No plan found for this patient' })
    }
    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Physical Therapy plan' })
  }
})



router.post("/DRAST-7ALA/upload-plan", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/DRAST-7ALA/plan");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  form.uploadDir = uploadDir;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error parsing uploaded file" });
    }

    // Ensure that patientId is not an array and is a valid string
    const patientId = fields.patientId && fields.patientId[0] ? fields.patientId[0] : null; // Extract the value from array if present

    if (!patientId) {
      console.log("Patient ID is missing!");
      return res.status(400).json({ message: "Patient ID is required" });
    }

    // Log the patientId to verify it's received correctly
    console.log("Patient ID from backend:", patientId);

    const file = files.document[0];
    const tempFilePath = file.filepath;
    const originalFileName = file.originalFilename;

    const uniqueFileName = `${uuidv4()}${path.extname(originalFileName)}`;
    const finalFilePath = path.join(uploadDir, uniqueFileName);

    fs.renameSync(tempFilePath, finalFilePath);

    try {
      // Now link the file to the patient in your database (DrastHalaPlan )
      const plan = await DrastHalaPlan.findOneAndUpdate(
        { patient: patientId }, // Find the plan by patientId
        {
          filePath: uniqueFileName,
          fileName: originalFileName,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
        },
        { new: true, upsert: true } // Update or create the plan
      );

      // Log the uploaded plan record to the console
      console.log("Uploaded Plan Record:", plan);

      // Send the response back to the client
      res.status(200).json({
        title: originalFileName.replace(/\.[^/.]+$/, ""),
        fileName: originalFileName,
        filePath: uniqueFileName,
        message: "Plan document uploaded and linked successfully!",
      });
    } catch (error) {
      console.error("Error linking document to plan:", error);
      res.status(500).json({ message: "Error linking document to plan" });
    }
  });
});



module.exports = router;