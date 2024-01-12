var path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const { testAndNewFile } = req.body;
    let testId = null;
    if (testAndNewFile) {
      console.log(JSON.parse(testAndNewFile));
      for (testFile of JSON.parse(testAndNewFile)) {
        if (testFile.files.find((el) => el == file.originalname)) {
          console.log(testFile.testId, "-++++++++");
          testId = "-" + testFile.testId;
          break;
        }
      }
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + testId + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB for each file (adjust the size as needed)
  },
});

module.exports = upload;
