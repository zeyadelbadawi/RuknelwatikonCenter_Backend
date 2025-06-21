const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For creating tokens
const mongoose = require('mongoose');
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');

const { v4: uuidv4 } = require('uuid');


const OccupationalTherapyPlan = require('../models/Occupational-therapy/OccupationalTherapyPlan');
const OccupationaltherapyExam = require('../models/Occupational-therapy/OccupationalTherapyExam');
const PatientoccupationalTherapyAssignment = require('../models/Occupational-therapy/PatientOccupationalTherapyAssignment');
const Patient = require('../models/users/Patient');



// Add Occupational Therapy Assignment
router.post('/assign-to-Occupational', async (req, res) => {
  const { patientId, notes } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: 'Invalid or missing patient ID' });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Ensure the patient is not already assigned to Occupational therapy
    const existingAssignment = await PatientoccupationalTherapyAssignment.findOne({
      patient: patientId,
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Patient already assigned to Occupational therapy' });
    }

    const assignment = new PatientoccupationalTherapyAssignment({
      patient: patientId,
      notes: notes || '',
      status: 'active',
    });

    await assignment.save();

    res.status(201).json({ message: 'Patient assigned to Occupational therapy successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning patient to Occupational therapy', error: err.message });
  }
});

// Get Occupational Therapy Assignments
router.get('/Occupational-therapy-assignments', async (req, res) => {
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

    const assignments = await PatientoccupationalTherapyAssignment.find(query)
      .populate({
        path: 'patient',
        select: 'name email phone disabilityType',
        model: 'Patient',
      })
      .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
      .limit(Number.parseInt(limit))
      .sort({ assignedDate: -1 });

    const totalAssignments = await PatientoccupationalTherapyAssignment.countDocuments(query);

    res.status(200).json({
      assignments,
      totalPages: Math.ceil(totalAssignments / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      totalAssignments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Occupational therapy assignments' });
  }
});

// Unassign from Occupational Therapy
router.delete('/unassign-from-Occupational/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const assignment = await PatientoccupationalTherapyAssignment.findOneAndDelete({ patient: patientId });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Patient unassigned from Occupational therapy' });
  } catch (err) {
    res.status(500).json({ message: 'Error unassigning patient' });
  }
});

// routes/Occupational-therapy.js (continued)

// Get Occupational Therapy Plan for a patient
router.get('/plan/:patientId', async (req, res) => {
  const { patientId } = req.params

  try {
    const plan = await OccupationalTherapyPlan.findOne({ patient: patientId }).sort({ lastModified: -1 })
    if (!plan) {
      return res.status(404).json({ message: 'No plan found for this patient' })
    }
    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Occupational Therapy plan' })
  }
})

// Create Occupational Therapy Plan
router.post('/plan', async (req, res) => {
  const { patient, title, content, createdBy } = req.body

  try {
    const plan = new OccupationalTherapyPlan({
      patient,
      title,
      content,
      createdBy: createdBy || 'System',
      lastModified: new Date(),
    })

    await plan.save()

    res.status(201).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error creating Occupational Therapy plan' })
  }
})

// Update Occupational Therapy Plan
router.put('/plan/:planId', async (req, res) => {
  const { planId } = req.params
  const { title, content, createdBy } = req.body

  try {
    const plan = await OccupationalTherapyPlan.findByIdAndUpdate(
      planId,
      { title, content, createdBy: createdBy || 'System', lastModified: new Date() },
      { new: true }
    )

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }

    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error updating Occupational Therapy plan' })
  }
})


router.post("/upload-plan", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/Occupational-therapy/plan");
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
      // Now link the file to the patient in your database (OccupationalTherapyPlan)
      const plan = await OccupationalTherapyPlan.findOneAndUpdate(
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



// Create Occupational Therapy Exam
router.post('/exam', async (req, res) => {
  const { patient, title, content, createdBy } = req.body

  try {
    const exam = new OccupationaltherapyExam({
      patient,
      title,
      content,
      createdBy: createdBy || 'System',
      lastModified: new Date(),
    })

    await exam.save()

    res.status(201).json(exam)
  } catch (err) {
    res.status(500).json({ message: 'Error creating Occupational Therapy Exam' })
  }
})

router.get('/exam/:patientId', async (req, res) => {
  const { patientId } = req.params

  try {
    const exam = await OccupationaltherapyExam.findOne({ patient: patientId }).sort({ lastModified: -1 })
    if (!exam) {
      return res.status(404).json({ message: 'No exam found for this patient' })
    }
    res.status(200).json(exam)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Occupational Therapy exam' })
  }
})

// Update Occupational Therapy Exam
router.put('/exam/:examId', async (req, res) => {
  const { ExamId } = req.params
  const { title, content, createdBy } = req.body

  try {
    const exam = await OccupationaltherapyExam.findByIdAndUpdate(
      examId,
      { title, content, createdBy: createdBy || 'System', lastModified: new Date() },
      { new: true }
    )

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' })
    }

    res.status(200).json(exam)
  } catch (err) {
    res.status(500).json({ message: 'Error updating Occupational Therapy exam' })
  }
})


router.post("/upload-exam", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/Occupational-therapy/exam");
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
      // Now link the file to the patient in your database (OccupationaltherapyExam)
      const exam = await OccupationaltherapyExam.findOneAndUpdate(
        { patient: patientId }, // Find the exam by patientId
        {
          filePath: uniqueFileName,
          fileName: originalFileName,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
        },
        { new: true, upsert: true } // Update or create the exam
      );

      // Log the uploaded exam record to the console
      console.log("Uploaded Exam Record:", exam);

      // Send the response back to the client
      res.status(200).json({
        title: originalFileName.replace(/\.[^/.]+$/, ""),
        fileName: originalFileName,
        filePath: uniqueFileName,
        message: "Exam document uploaded and linked successfully!",
      });
    } catch (error) {
      console.error("Error linking document to exam:", error);
      res.status(500).json({ message: "Error linking document to exam" });
    }
  });
});




module.exports = router;