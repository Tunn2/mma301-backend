const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const { getCoursesService } = require("../services/course.service");
const { getCoursesController } = require("../controllers/course.controller");
const Course = require("../models/course.model");

const viewRoute = express.Router();
viewRoute.get("/login", (req, res) => {
  res.render("index", { title: "haha" });
});

viewRoute.get("/", async (req, res) => {
  const courses = await Course.find();
  res.render("", { courses });
});

module.exports = viewRoute;
