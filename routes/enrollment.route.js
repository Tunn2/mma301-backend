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

enrollmentRoute.use(authenticate);
enrollmentRoute.post("/", createEnrollmentController);
enrollmentRoute.get("/vnpay-ipn", verifyIPNCall);

module.exports = enrollmentRoute;
