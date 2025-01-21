const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  storageBucket: "gs://netflix-clone-618f2.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
