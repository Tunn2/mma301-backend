const mongoose = require("mongoose");

const completedLessonSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Types.ObjectId,
    ref: "Lesson",
    require: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  completionDate: {
    type: Date,
    default: Date.now(),
  },
});

const CompletedLesson = mongoose.model(
  "CompletedLesson",
  completedLessonSchema
);
module.exports = CompletedLesson;
