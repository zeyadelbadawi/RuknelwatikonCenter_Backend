const mongoose = require("mongoose");

const StudentsAppointmentDepartmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentsAppointmentDepartment = mongoose.model(
  "studentsappointmentdepartment",
  StudentsAppointmentDepartmentSchema
);

module.exports = StudentsAppointmentDepartment;
