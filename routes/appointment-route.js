const express = require("express");
const Appointment = require("../models/appointment");
const appointmentRouter = express.Router();
const allowedDepartments = [
  "PhysicalTherapy",
  "ABA",
  "OccupationalTherapy",
  "SpecialEducation",
  "Speech",
  "ay7aga",
];

function extractTime(date) {
  const d = new Date(date);
  return d.getHours() * 60 + d.getMinutes();
}

// Handle creating a new appointment
appointmentRouter.post("/", async (req, res) => {
  try {
    const { department, day, start_time, end_time, doctor } = req.body;

    // Validate department enum
    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({ error: "Invalid department" });
    }
    // Validate required fields
    if (!day || !start_time || !end_time || !doctor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: Validate time logic
    const start = new Date(start_time);
    const end = new Date(end_time);

    console.log(
      "Start time:",
      extractTime(start),
      "End time:",
      extractTime(end)
    );

    if (extractTime(start) >= extractTime(end)) {
      return res
        .status(400)
        .json({ error: "Start time must be before end time" });
    }

    // Check for overlapping appointments
    const overlappingAppointments = await Appointment.find({
      department,
      day,
      doctor,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({
        error: "Appointment time overlaps with existing appointments",
      });
    }

    const appointment = new Appointment({
      department,
      day,
      doctor,
      start_time: start_time,
      end_time: end_time,
    });

    await appointment.save();
    return res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create appointment" });
  }
});
/* appointmentRouter.post("/", async (req, res) => {
  try {
    const data = Array.isArray(req.body.appointments)
      ? req.body.appointments
      : [req.body.appointments];

    const successfulAppointments = [];
    const failedAppointments = [];

    for (const item of data) {
      const { department, day, start_time, end_time, doctor } = item;

      console.log("Processing item:", item);

      // Validate required fields
      if (!department || !day || !start_time || !end_time || !doctor) {
        failedAppointments.push({ ...item, reason: "Missing required fields" });
        continue;
      }

      // Validate department
      if (!allowedDepartments.includes(department)) {
        failedAppointments.push({ ...item, reason: "Invalid department" });
        continue;
      }

      const start = new Date(start_time);
      const end = new Date(end_time);

      // Validate time logic
      if (extractTime(start) >= extractTime(end)) {
        failedAppointments.push({
          ...item,
          reason: "Start time must be before end time",
        });
        continue;
      }

      // Check for overlaps
      const overlap = await Appointment.findOne({
        department,
        day,
        doctor,
        start_time: { $lt: end_time },
        end_time: { $gt: start_time },
      });

      if (overlap) {
        failedAppointments.push({
          ...item,
          reason: "Time overlaps with existing appointment",
        });
        continue;
      }

      // All validations passed
      successfulAppointments.push({
        department,
        day,
        doctor,
        start_time: start,
        end_time: end,
      });
    }

    // Insert valid appointments
    let inserted = [];
    if (successfulAppointments.length > 0) {
      inserted = await Appointment.insertMany(successfulAppointments, {
        ordered: false,
      });
    }

    return res.status(200).json({
      message: "Appointment processing completed",
      inserted,
      failedAppointments,
    });
  } catch (error) {
    console.error("Insert failed:", error);
    return res.status(500).json({ error: "Failed to process appointments" });
  }
}); */

appointmentRouter.get("/findByDepartment/:department", async (req, res) => {
  try {
    const { department } = req.params;

    // Validate department enum
    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({ error: "Invalid department" });
    }

    const appointments = await Appointment.find({ department });
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Handle fetching a single appointment by ID
appointmentRouter.get("/findById/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById({
      _id: req.params.id,
    }).populate("doctor");
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    return res.status(200).json({ appointment });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

appointmentRouter.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor");
    return res.status(200).json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Handle updating an appointment by ID
appointmentRouter.put("/:id", async (req, res) => {
  try {
    const { department, day, start_time, end_time, doctor } = req.body;

    // Validate department enum
    if (!allowedDepartments.includes(department)) {
      return res.status(400).json({ error: "Invalid department" });
    }
    // Validate required fields
    if (!day || !start_time || !end_time || !doctor) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Optional: Validate time logic
    const start = new Date(start_time);
    const end = new Date(end_time);

    if (extractTime(start) >= extractTime(end)) {
      return res
        .status(400)
        .json({ error: "Start time must be before end time" });
    }

    // Check for overlapping appointments
    const overlappingAppointments = await Appointment.find({
      department,
      day,
      doctor,
      start_time: { $lt: end_time },
      end_time: { $gt: start_time },
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({
        error: "Appointment time overlaps with existing appointments",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { department, day, start_time, end_time, doctor },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update appointment" });
  }
});

// Handle deleting an appointment by ID
appointmentRouter.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete appointment" });
  }
});

module.exports = appointmentRouter;
