const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createEnrollmentController,
} = require("../controllers/enrollment.controller");

const enrollmentRoute = express.Router();

enrollmentRoute.use(authenticate);
enrollmentRoute.post("/", createEnrollmentController);

module.exports = enrollmentRoute;
