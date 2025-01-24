const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createEnrollmentController,
  verifyIPNCall,
} = require("../controllers/enrollment.controller");

const enrollmentRoute = express.Router();

enrollmentRoute.get("/vnpay-ipn", verifyIPNCall);

enrollmentRoute.use(authenticate);
enrollmentRoute.post("/", createEnrollmentController);

module.exports = enrollmentRoute;
