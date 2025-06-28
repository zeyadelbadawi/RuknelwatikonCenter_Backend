// Import required modules
const express = require("express");

// Create a router
const router = express.Router();

const authentication = require("./authentication");
const physicalTherapy = require("./physicalTherapy");
const DrastHala = require("./DrastHala");
const school = require("./school");
const aba = require("./aba");
const OccupationalTherapy = require("./OccupationalTherapy");
const SpecialEducation = require("./SpecialEducation");
const speech = require("./speech");
const full = require("./full");
const appointmentRouter = require("./appointment-route");
const studentsAppointmentDepartmentRouter = require("./studentsAppointmentDepartment-route");

router.use("/authentication", authentication);
router.use("/physicalTherapy", physicalTherapy);
router.use("/DrastHala", DrastHala);
router.use("/school", school);
router.use("/aba", aba);
router.use("/OccupationalTherapy", OccupationalTherapy);
router.use("/SpecialEducation", SpecialEducation);
router.use("/speech", speech);
router.use("/full", full);
router.use("/appointments", appointmentRouter);
router.use("/students-appointment", studentsAppointmentDepartmentRouter);

// Export the router
module.exports = function (app) {
  app.use("/", router);
};
