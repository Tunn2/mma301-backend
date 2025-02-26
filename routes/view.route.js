const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const { getCoursesService } = require("../services/course.service");
const { getCoursesController } = require("../controllers/course.controller");
const Category = require("../models/category.model");
const { getCategoryByIdService } = require("../services/category.service");

const viewRoute = express.Router();
viewRoute.get("/login", (req, res) => {
  res.render("login");
});

viewRoute.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const category = await getCategoryByIdService(id);
  console.log(category);
  res.render("edit", { category });
});

viewRoute.get("/", async (req, res) => {
  const categories = await Category.find();
  res.render("", { categories });
});

viewRoute.get("/add", (req, res) => {
  res.render("add");
});

module.exports = viewRoute;
