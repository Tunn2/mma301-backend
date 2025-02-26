const { default: mongoose } = require("mongoose");
const Lesson = require("../models/lesson.model");
const { getChapterByIdService } = require("./chapter.service");
const CompletedLesson = require("../models/completed-lesson.model");

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

const handleCompletedLessonService = async ({ userId, lessonId }) => {
  const foundLesson = await Lesson.find({
    _id: new mongoose.Types.ObjectId(lessonId),
  });
  if (!foundLesson) throw new Error("Lesson not found");

  const foundCompletedLesson = await CompletedLesson.findOne({
    user: new mongoose.Types.ObjectId(userId),
    lesson: new mongoose.Types.ObjectId(lessonId),
  });
  if (foundCompletedLesson) throw new Error("This lesson has been finished");

  return await CompletedLesson.create({
    user: new mongoose.Types.ObjectId(userId),
    lesson: new mongoose.Types.ObjectId(lessonId),
  });
};

const getCompletedLessonByUserIdService = async ({ userId }) => {
  const lesson = await CompletedLesson.find({
    user: new mongoose.Types.ObjectId(userId),
  })
    .select("lesson")
    .lean();
  const ids = lesson.map((lesson) => lesson.lesson);
  return ids;
};

module.exports = {
  createLessonService,
  getLessonByChapterIdService,
  handleCompletedLessonService,
  getCompletedLessonByUserIdService,
};
