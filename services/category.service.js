const Category = require("../models/category.model");

const createCategoryService = async ({ title }) => {
  try {
    const category = await Category.findOne({ title });
    if (category) throw new Error("This category already existed");
    return await Category.create({ title });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCategoryService,
};
