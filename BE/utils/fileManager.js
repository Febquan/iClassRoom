const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

async function deleteFile(path) {
  await unlinkFile(path);
}

module.exports = {
  deleteFile,
};
