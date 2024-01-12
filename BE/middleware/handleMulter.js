const { MulterError } = require("multer");
const upload = require("../utils/upload");
function HandleMulterError(req, res, next) {
  upload.array("files")(req, res, (err) => {
    if (err instanceof MulterError) {
      return res.status(400).send("File size limit exceeded");
    } else if (err) {
      console.error(err);
      return res.status(500).send("Internal server error.");
    }

    next();
  });
}

module.exports = HandleMulterError;
