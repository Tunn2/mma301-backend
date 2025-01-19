const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
} = require("../controllers/course.controller");
const courseRoute = express.Router();

courseRoute.get("/", getCoursesController);
courseRoute.get("/:id", getCourseByIdController);

courseRoute.use(authenticate);
courseRoute.use(checkAdminRole);
courseRoute.post("/", createCourseController);

module.exports = courseRoute;
