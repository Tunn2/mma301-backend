const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  getChapterByCourseIdController,
  createChapterController,
} = require("../controllers/chapter.controller");

const chapterRoute = express.Router();

chapterRoute.use(authenticate);
chapterRoute.get("/course/:courseId", getChapterByCourseIdController);

chapterRoute.use(checkAdminRole);
chapterRoute.post("/", createChapterController);
// chapterRoute.delete("/:id", deleteCourseByIdController);

module.exports = chapterRoute;
