const { default: mongoose } = require("mongoose");
const Chapter = require("../models/chapter.model");
const { getCourseByIdService } = require("./course.service");

const createChapterService = async ({ title, courseId }) => {
  const foundCourse = await getCourseByIdService(courseId);
  return await Chapter.create({
    title,
    course: new mongoose.Types.ObjectId(courseId),
  });
};

const getChaptersByCourseIdService = async (courseId) => {
  const foundCourse = await getCourseByIdService(courseId);
  const chapters = await Chapter.find({
    course: new mongoose.Types.ObjectId(courseId),
  }).lean();
  return chapters;
};

const getChapterByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid object id");
  }
  const chapter = await Chapter.findOne({
    _id: new mongoose.Types.ObjectId(id),
  }).lean();
  if (!chapter) {
    throw new Error("Chapter not found");
  }
  return chapter;
};

module.exports = {
  createChapterService,
  getChaptersByCourseIdService,
  getChapterByIdService,
};
