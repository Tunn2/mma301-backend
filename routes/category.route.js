const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createCategoryController,
  getCategoriesController,
} = require("../controllers/category.controller");
const categoryRoute = express.Router();

categoryRoute.get("/", getCategoriesController);

categoryRoute.use(authenticate);
categoryRoute.use(checkAdminRole);

categoryRoute.post("/", createCategoryController);

module.exports = categoryRoute;
