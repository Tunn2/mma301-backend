const { default: mongoose } = require("mongoose");
const Category = require("../models/category.model");

const createCategoryService = async ({ title }) => {
  const category = await Category.findOne({ title });
  if (category) throw new Error("This category already existed");
  return await Category.create({ title });
};

const getCategoriesService = async () => {
  return await Category.find().select("_id title").lean();
};

const updateCategoryByIdService = async (id, { title }) => {
  if (!id || !new mongoose.Types.ObjectId(id))
    throw new Error("Invalid category id");

  await Category.findOneAndUpdate({ _id: id }, { title })
    .select("_id title")
    .lean();
  return await Category.findOne({ _id: new mongoose.Types.ObjectId(id) })
    .select("_id title")
    .lean();
};

const getCategoryByIdService = async (id) => {
  if (!id || !new mongoose.Types.ObjectId(id))
    throw new Error("Invalid category id");
  return await Category.findOne({ _id: new mongoose.Types.ObjectId(id) })
    .select("_id title")
    .lean();
};

module.exports = {
  createCategoryService,
  getCategoriesService,
  updateCategoryByIdService,
  getCategoryByIdService,
};
