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
} = require("../controllers/course.controller");
const courseRoute = express.Router();

courseRoute.get("/", getCoursesController);
courseRoute.get("/:id", getCourseByIdController);
courseRoute.get("/category/:categoryId", getCourseByCategoryIdController);

courseRoute.use(authenticate);
courseRoute.use(checkAdminRole);
courseRoute.post("/", upload.single("thumbnail"), createCourseController);
courseRoute.delete("/:id", deleteCourseByIdController);

module.exports = courseRoute;
