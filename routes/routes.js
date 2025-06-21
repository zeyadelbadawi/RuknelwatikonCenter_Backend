// Import required modules
const express = require("express");

// Create a router
const router = express.Router();

const authentication = require("./authentication");


router.use("/authentication", authentication);

// Export the router
module.exports = function (app) {
  app.use("/", router);
};
