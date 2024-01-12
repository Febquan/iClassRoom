require("dotenv").config();
const fs = require("fs");

const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3,
  GetObjectCommand,
  DeleteObjectsCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,

  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// uploads a file to s3
function uploadFile(file, folder) {
  const fileStream = fs.createReadStream(file.path);

  // Append the folder to the Key
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${folder}/${file.filename}`,  // Add the folder here
  };

  return new Upload({
    client: s3,
    params: uploadParams,
  }).done();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
    ResponseContentDisposition: "attachment; filename=the filename I want",
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;

async function getS3PresignedUrl(fileKey) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename=${getFileName(fileKey)}`,
  });
  return await getSignedUrl(s3, command, { expiresIn: 60 });
}
function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
const getFileName = (key) => {
  const pos = getPosition(key, "-", 2);
  return key.substring(pos + 1);
};
exports.getS3PresignedUrl = getS3PresignedUrl;

const deleteMultipleFiles = async (filekeys) => {
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: filekeys.map((key) => ({ Key: key })),
    },
  };

  await s3.send(new DeleteObjectsCommand(params));
};
exports.s3DeleteFiles = deleteMultipleFiles;
