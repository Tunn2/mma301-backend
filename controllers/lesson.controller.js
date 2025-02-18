const {
  createLessonService,
  handleCompletedLessonService,
} = require("../services/lesson.service");
const {
  uploadVideoToFirebase,
  uploadDocumentToFirebase,
} = require("../services/upload.service");

const createLessonController = async (req, res) => {
  try {
    const { title, chapterId } = req.body;
    if (!req.files || !req.files.video || !req.files.document) {
      throw new Error("Both video and document are required");
    }
    const videoUrl = await uploadVideoToFirebase(req.files.video[0]);
    const documentUrl = await uploadDocumentToFirebase(req.files.document[0]);
    return res.send(
      await createLessonService({ title, videoUrl, chapterId, documentUrl })
    );
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

const handleCompletedLessonController = async (req, res) => {
  try {
    const userId = req.userId;
    const { lessonId } = req.params;
    return res.send(await handleCompletedLessonService({ userId, lessonId }));
  } catch (error) {
    return res.send({ errorCode: 1, message: error.message });
  }
};

module.exports = {
  createLessonController,
  handleCompletedLessonController,
};
