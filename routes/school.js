const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For generating unique file names
const router = express.Router(); // For creating tokens
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');

const SchoolPlan = require('../models/School/schoolPlan');
const PatientSchoolAssignment = require('../models/School/patientSchoolAssignment');
const Patient = require('../models/users/Patient');



// Add school Assignment
router.post('/assign-to-school', async (req, res) => {
  const { patientId, notes } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: 'Invalid or missing patient ID' });
  }

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Ensure the patient is not already assigned to school
    const existingAssignment = await PatientSchoolAssignment.findOne({
      patient: patientId,
    });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Patient already assigned to school' });
    }

    const assignment = new PatientSchoolAssignment({
      patient: patientId,
      notes: notes || '',
      status: 'active',
    });

    await assignment.save();

    res.status(201).json({ message: 'Patient assigned to school successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning patient to school', error: err.message });
  }
});

// Get school Assignments
router.get('/school-assignments', async (req, res) => {
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

    const assignments = await PatientSchoolAssignment.find(query)
      .populate({
        path: 'patient',
        select: 'name email phone disabilityType',
        model: 'Patient',
      })
      .skip((Number.parseInt(page) - 1) * Number.parseInt(limit))
      .limit(Number.parseInt(limit))
      .sort({ assignedDate: -1 });

    const totalAssignments = await PatientSchoolAssignment.countDocuments(query);

    res.status(200).json({
      assignments,
      totalPages: Math.ceil(totalAssignments / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      totalAssignments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching school assignments' });
  }
});

// Unassign from school
router.delete('/unassign-from-school/:patientId', async (req, res) => {
  const { patientId } = req.params;

  try {
    const assignment = await PatientSchoolAssignment.findOneAndDelete({ patient: patientId });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({ message: 'Patient unassigned from school' });
  } catch (err) {
    res.status(500).json({ message: 'Error unassigning patient' });
  }
});

// routes/physical-therapy.js (continued)

// Get school Plan for a patient
router.get('/plan/:patientId', async (req, res) => {
  const { patientId } = req.params

  try {
    const plan = await SchoolPlan.findOne({ patient: patientId }).sort({ lastModified: -1 })
    if (!plan) {
      return res.status(404).json({ message: 'No plan found for this patient' })
    }
    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching school plan' })
  }
})

// Create school Plan
router.post('/plan', async (req, res) => {
  const { patient, title, content, createdBy } = req.body

  try {
    const plan = new SchoolPlan({
      patient,
      title,
      content,
      createdBy: createdBy || 'System',
      lastModified: new Date(),
    })

    await plan.save()

    res.status(201).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error creating school plan' })
  }
})

// Update school Plan
router.put('/plan/:planId', async (req, res) => {
  const { planId } = req.params
  const { title, content, createdBy } = req.body

  try {
    const plan = await SchoolPlan.findByIdAndUpdate(
      planId,
      { title, content, createdBy: createdBy || 'System', lastModified: new Date() },
      { new: true }
    )

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }

    res.status(200).json(plan)
  } catch (err) {
    res.status(500).json({ message: 'Error updating school plan' })
  }
})


router.post("/upload-plan", (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10MB

  const uploadDir = path.join(__dirname, "../uploads/school-plan/plan");
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
      // Now link the file to the patient in your database (SchoolPlan)
      const plan = await SchoolPlan.findOneAndUpdate(
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