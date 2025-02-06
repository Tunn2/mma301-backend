const {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  getCourseByCategoryIdService,
  deleteACourseByIdService,
} = require("../services/course.service");
const { uploadImageToFirebase } = require("../services/upload.service");

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
    if (!req.file) {
      throw new Error("Thumbnail is required");
    }
    const thumbnailUrl = await uploadImageToFirebase(req.file);
    const { title, description, price, author, category } = req.body;
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

const deleteCourseByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    return res.send(await deleteACourseByIdService(id));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  getCourseByCategoryIdController,
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  deleteCourseByIdController,
};
