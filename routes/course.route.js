const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  getCourseByCategoryIdController,
  deleteCourseByIdController,
  getCoursesByUserIdController,
} = require("../controllers/course.controller");
const { default: mongoose } = require("mongoose");
const courseRoute = express.Router();

courseRoute.get("/", getCoursesController);

courseRoute.get("/category/:categoryId", getCourseByCategoryIdController);
courseRoute.get("/:id", getCourseByIdController);

courseRoute.use(authenticate);
courseRoute.get("/my-courses/purchased", getCoursesByUserIdController);

courseRoute.use(checkAdminRole);
courseRoute.post("/", upload.single("thumbnail"), createCourseController);
courseRoute.delete("/:id", deleteCourseByIdController);

module.exports = courseRoute;
