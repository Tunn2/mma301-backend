const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createCategoryController,
} = require("../controllers/category.controller");
const categoryRoute = express.Router();

categoryRoute.use(authenticate);
categoryRoute.use(checkAdminRole);

categoryRoute.post("/", createCategoryController);

module.exports = categoryRoute;
