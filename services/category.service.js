const Category = require("../models/category.model");

const createCategoryService = async ({ title }) => {
  const category = await Category.findOne({ title });
  if (category) throw new Error("This category already existed");
  return await Category.create({ title });
};

module.exports = {
  createCategoryService,
};
