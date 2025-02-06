const {
  createCategoryService,
  getCategoriesService,
  updateCategoryByIdService,
  getCategoryByIdService,
} = require("../services/category.service");

const createCategoryController = async (req, res) => {
  try {
    const { title } = req.body;
    return res.send(await createCategoryService({ title }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCategoriesController = async (req, res) => {
  try {
    return res.send(await getCategoriesService());
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const updateCategoryByIdController = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    return res.send(await updateCategoryByIdService(id, { title }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCategoryBydIdController = async (req, res) => {
  try {
    const { id } = req.params;
    return res.send(await getCategoryByIdService(id));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createCategoryController,
  getCategoriesController,
  updateCategoryByIdController,
  getCategoryBydIdController,
};
