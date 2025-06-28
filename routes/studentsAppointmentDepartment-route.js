const express = require("express");
const StudentsAppointmentDepartment = require("../models/StudentsAppointmentDepartment");
const Patient = require("../models/users/Patient");
/* Category */
const PatientPhysicalTherapyAssignment = require("../models/physicalTherapy/PatientPhysicalTherapyAssignment");
const PatientABAAssignment = require("../models/ABA/PatientABAAssignment");
const PatientoccupationalTherapyAssignment = require("../models/Occupational-therapy/PatientOccupationalTherapyAssignment");
const PatientSpecialEducationAssignment = require("../models/Special-Education/PatientSpecialEducationAssignment");
const PatientSpeechAssignment = require("../models/Speech/PatientSpeechAssignment");
//
const studentsAppointmentDepartmentRouter = express.Router();

/* add function */
studentsAppointmentDepartmentRouter.post("/", async (req, res) => {
  try {
    const { patientId, appointmentId, department } = req.body;

    // Validate required fields
    if (!patientId || !appointmentId || !department) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for overlapping appointments
    const overlappingAppointments = await StudentsAppointmentDepartment.find({
      department,
      appointmentId,
      patientId,
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({
        error: "Appointment time overlaps with existing appointments",
      });
    }

    const studentsAppointment = new StudentsAppointmentDepartment({
      appointmentId,
      patientId,
      department,
    });

    await studentsAppointment.save();
    return res.status(201).json({
      message: "Students appointment created successfully",
      studentsAppointment: studentsAppointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create Students appointment" });
  }
});

/* All function */
studentsAppointmentDepartmentRouter.get(
  "/:department/:slotId",
  async (req, res) => {
    try {
      const { department, slotId } = req.params;
      // Validate required fields
      if (!department || !slotId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const studentsAppointment = await StudentsAppointmentDepartment.find({
        department,
        appointmentId: slotId,
      }).populate(["patientId", "appointmentId"]);
      return res.status(200).json({ studentsAppointment: studentsAppointment });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch students appointment" });
    }
  }
);

/* Delete function */
studentsAppointmentDepartmentRouter.delete("/:id", async (req, res) => {
  try {
    const deletedStudentsAppointmentDepartment =
      await StudentsAppointmentDepartment.findByIdAndDelete(req.params.id);
    if (!deletedStudentsAppointmentDepartment) {
      return res.status(404).json({ error: "Student appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Student appointment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete student appointment" });
  }
});

/* py */
studentsAppointmentDepartmentRouter.get(
  "/physical-therapy-assignments/:department/:appointmentId",
  async (req, res) => {
    const { department, appointmentId } = req.params;

    try {
      if (!department || !appointmentId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Find all students registered in the given appointment and department
      const registeredStudents = await StudentsAppointmentDepartment.find({
        department: department,
        appointmentId: appointmentId,
      }).select("patientId");

      // Extract just the patientIds from the results
      const registeredStudentIds = registeredStudents.map(
        (student) => student.patientId
      );

      // Find all students NOT in the registeredStudentIds array
      const unregisteredStudents = await PatientPhysicalTherapyAssignment.find({
        patient: { $nin: registeredStudentIds },
      }).populate("patient");

      return res.status(200).json({
        assignments: unregisteredStudents,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching physical therapy assignments" });
    }
  }
);
/* ABA-assignments */
studentsAppointmentDepartmentRouter.get(
  "/ABA-assignments/:department/:appointmentId",
  async (req, res) => {
    const { department, appointmentId } = req.params;

    try {
      if (!department || !appointmentId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Find all students registered in the given appointment and department
      const registeredStudents = await StudentsAppointmentDepartment.find({
        department: department,
        appointmentId: appointmentId,
      }).select("patientId");

      // Extract just the patientIds from the results
      const registeredStudentIds = registeredStudents.map(
        (student) => student.patientId
      );

      // Find all students NOT in the registeredStudentIds array
      const unregisteredStudents = await PatientABAAssignment.find({
        patient: { $nin: registeredStudentIds },
      }).populate("patient");

      return res.status(200).json({
        assignments: unregisteredStudents,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching ABA assignments" });
    }
  }
);
/* Occupational-therapy-assignments */
studentsAppointmentDepartmentRouter.get(
  "/Occupational-therapy-assignments/:department/:appointmentId",
  async (req, res) => {
    const { department, appointmentId } = req.params;

    try {
      if (!department || !appointmentId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Find all students registered in the given appointment and department
      const registeredStudents = await StudentsAppointmentDepartment.find({
        department: department,
        appointmentId: appointmentId,
      }).select("patientId");

      // Extract just the patientIds from the results
      const registeredStudentIds = registeredStudents.map(
        (student) => student.patientId
      );

      // Find all students NOT in the registeredStudentIds array
      const unregisteredStudents =
        await PatientoccupationalTherapyAssignment.find({
          patient: { $nin: registeredStudentIds },
        }).populate("patient");

      return res.status(200).json({
        assignments: unregisteredStudents,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching Occupational therapy assignments" });
    }
  }
);
/* Special-Education-assignments */
studentsAppointmentDepartmentRouter.get(
  "/Special-Education-assignments/:department/:appointmentId",
  async (req, res) => {
    const { department, appointmentId } = req.params;

    try {
      if (!department || !appointmentId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Find all students registered in the given appointment and department
      const registeredStudents = await StudentsAppointmentDepartment.find({
        department: department,
        appointmentId: appointmentId,
      }).select("patientId");

      // Extract just the patientIds from the results
      const registeredStudentIds = registeredStudents.map(
        (student) => student.patientId
      );

      // Find all students NOT in the registeredStudentIds array
      const unregisteredStudents = await PatientSpecialEducationAssignment.find(
        {
          patient: { $nin: registeredStudentIds },
        }
      ).populate("patient");

      return res.status(200).json({
        assignments: unregisteredStudents,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching Special Education assignments" });
    }
  }
);
/* Speech-assignments */
studentsAppointmentDepartmentRouter.get(
  "/Speech-assignments/:department/:appointmentId",
  async (req, res) => {
    const { department, appointmentId } = req.params;

    try {
      if (!department || !appointmentId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Find all students registered in the given appointment and department
      const registeredStudents = await StudentsAppointmentDepartment.find({
        department: department,
        appointmentId: appointmentId,
      }).select("patientId");

      // Extract just the patientIds from the results
      const registeredStudentIds = registeredStudents.map(
        (student) => student.patientId
      );

      // Find all students NOT in the registeredStudentIds array
      const unregisteredStudents = await PatientSpeechAssignment.find({
        patient: { $nin: registeredStudentIds },
      }).populate("patient");

      return res.status(200).json({
        assignments: unregisteredStudents,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching Speech assignments" });
    }
  }
);

module.exports = studentsAppointmentDepartmentRouter;