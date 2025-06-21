const express = require('express');
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const DrastHalaPlan = require('../models/drasthala/DrastHalaPlans');


router.get('/plan/:patientId', async (req, res) => {
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



// Create Physical Therapy Plan
router.post('/plan', async (req, res) => {
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
router.put('/plan/:planId', async (req, res) => {
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




router.post("/upload-plan", (req, res) => {
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