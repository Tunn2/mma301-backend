const {
  createCategoryService,
  getCategoriesService,
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

module.exports = {
  createCategoryController,
  getCategoriesController,
};
