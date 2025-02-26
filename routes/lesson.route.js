const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createLessonController,
  handleCompletedLessonController,
  getCompletedLessonByUserIdController,
} = require("../controllers/lesson.controller");

const lessonRoute = express.Router();

lessonRoute.use(authenticate);
// lessonRoute.get("/course/:courseId");
lessonRoute.post("/completed/:lessonId", handleCompletedLessonController);
lessonRoute.get("/completed/", getCompletedLessonByUserIdController);

lessonRoute.use(checkAdminRole);
lessonRoute.post(
  "/",
  upload.fields([
    { name: "document", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createLessonController
);
// lessonRoute.delete("/:id", deleteCourseByIdController);

module.exports = lessonRoute;
