// Import required modules
const express = require("express");

// Create a router
const router = express.Router();

const authentication = require("./authentication");
const physicalTherapy = require("./physicalTherapy");
const DrastHala = require("./DrastHala");
const school = require("./school");
const ABA = require("./aba");
const OccupationalTherapy = require("./OccupationalTherapy");
const SpecialEducation = require("./SpecialEducation");


router.use("/authentication", authentication);
router.use("/physicalTherapy", physicalTherapy);
router.use("/DrastHala", DrastHala);
router.use("/school", school);
router.use("/aba", ABA);
router.use("/OccupationalTherapy", OccupationalTherapy);
router.use("/SpecialEducation", SpecialEducation);

// Export the router
module.exports = function (app) {
  app.use("/", router);
};
