const {
  createChapterService,
  getChaptersByCourseIdService,
} = require("../services/chapter.service");

const createChapterController = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    return res.send(await createChapterService({ title, courseId }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const getChapterByCourseIdController = async (req, res) => {
  const { courseId } = req.params;
  try {
    return res.send(await getChaptersByCourseIdService(courseId));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  getChapterByCourseIdController,
  createChapterController,
};
