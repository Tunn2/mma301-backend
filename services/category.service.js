const Category = require("../models/category.model");

const createCategoryService = async ({ title }) => {
  const category = await Category.findOne({ title });
  if (category) throw new Error("This category already existed");
  return await Category.create({ title });
};

const getCategoriesService = async () => {
  return await Category.find().select("_id title").lean();
};

module.exports = {
  createCategoryService,
  getCategoriesService,
};
