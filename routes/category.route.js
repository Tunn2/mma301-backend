const express = require("express");
const {
  authenticate,
  checkAdminRole,
} = require("../middlewares/auth.middleware");
const {
  createCategoryController,
  getCategoriesController,
  updateCategoryByIdController,
  getCategoryBydIdController,
  deleteCategoryByIdController,
} = require("../controllers/category.controller");
const categoryRoute = express.Router();

categoryRoute.get("/", getCategoriesController);
categoryRoute.get("/:id", getCategoryBydIdController);

categoryRoute.use(authenticate);
categoryRoute.use(checkAdminRole);

categoryRoute.post("/", createCategoryController);
categoryRoute.put("/:id", updateCategoryByIdController);
categoryRoute.delete("/:id", deleteCategoryByIdController);

module.exports = categoryRoute;
