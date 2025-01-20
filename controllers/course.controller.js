const {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  getCourseByCategoryIdService,
} = require("../services/course.service");

const getCourseByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    return res.send(await getCourseByIdService(id));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const createCourseController = async (req, res) => {
  try {
    const { title, description, price, thumbnailUrl, author, category } =
      req.body;
    return res.send(
      await createCourseService({
        title,
        description,
        price,
        thumbnailUrl,
        author,
        category,
      })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCoursesController = async (req, res) => {
  try {
    const { search, limit, page } = req.query;
    return res.send(await getCoursesService({ limit, page, search }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getCourseByCategoryIdController = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { categoryId } = req.params;
    return res.send(
      await getCourseByCategoryIdService({ limit, categoryId, page })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  getCourseByCategoryIdController,
  createCourseController,
  getCoursesController,
  getCourseByIdController,
};
