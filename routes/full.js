// In your backend routes (Express.js example)

const express = require("express");
const router = express.Router();
const FullProgram = require("../models/FullProgram");

// GET all appointments
router.get("/fullprogram", async (req, res) => {
  try {
    const appointments = await FullProgram.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE an appointment
// UPDATE an appointment
router.put("/fullprogram/:id", async (req, res) => {
  try {
    const { status, ...appointmentData } = req.body;

    // Find the appointment by ID
    const appointment = await FullProgram.findById(req.params.id);

    // Parse the appointment date and time
    const currentDateTime = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);

    // If the appointment time has passed and the status is not 'complete', mark it as complete
    if (appointmentDateTime < currentDateTime && appointment.status !== "complete") {
      appointment.status = "complete"; // Set to 'complete'
    }

    // Update the appointment with new data, including the new status if necessary
    const updatedAppointment = await FullProgram.findByIdAndUpdate(req.params.id, 
      { ...appointmentData, status: appointment.status }, 
      { new: true }
    );

    // Send the updated appointment back as the response
    res.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE an appointment
router.delete("/fullprogram/:id", async (req, res) => {
  try {
    await FullProgram.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a single appointment by ID
router.get("/appointments/:id", async (req, res) => {
  try {
    const appointment = await FullProgram.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
