const { default: mongoose } = require("mongoose");
const Lesson = require("../models/lesson.model");
const { getChapterByIdService } = require("./chapter.service");

const createLessonService = async ({
  title,
  documentUrl,
  videoUrl,
  chapterId,
}) => {
  const chapter = await getChapterByIdService(chapterId);
  return await Lesson.create({
    title,
    chapter: new mongoose.Types.ObjectId(chapterId),
    videoUrl,
    documentUrl,
  });
};

const getLessonByChapterIdService = async (chapterId) => {
  const chapter = await getChapterByIdService(chapterId);
  const lessons = await Lesson.find({
    chapter: new mongoose.Types.ObjectId(chapterId),
  }).lean();
  return lessons;
};

module.exports = { createLessonService, getLessonByChapterIdService };
