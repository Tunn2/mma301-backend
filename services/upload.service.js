const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bucket = require("../configs/firebase.config");
const uploadImageToFirebase = async (file) => {
  const validImage = isValidImage(file);
  if (!validImage) throw new Error("Thumbnail must be an image");
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const blob = bucket.file(`images/${fileName}`);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

const uploadVideoToFirebase = async (file) => {
  return new Promise((resolve, reject) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const blob = bucket.file(`videos/${fileName}`);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

const isValidImage = (file) => {
  if (file.mimetype.startsWith("image/")) return true;
  return false;
};

module.exports = { uploadVideoToFirebase, uploadImageToFirebase };
