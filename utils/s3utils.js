
const fs = require("fs")
const path = require('path')

const { Upload } = require('@aws-sdk/lib-storage')

const s3 = require('../config/s3')

const uploadOnS3 = async ( localFilePath ) => {
    try {
 // create stream
    const fileStream =
      fs.createReadStream(localFilePath);

    // unique filename
    const fileName = `uploads/${Date.now()}-${path.basename(
      localFilePath
    )}`;

    // upload
    const upload = new Upload({
      client: s3,

      params: {
        Bucket:
          process.env.AWS_BUCKET_NAME,

        Key: fileName,

        Body: fileStream,

        ACL: "public-read",
      },
    });

    const response = await upload.done();

    // delete temp file
    fs.unlinkSync(localFilePath);

    return {
      secure_url: response.Location,

      public_id: response.Key,
    };
  } catch (error) {
    // delete temp file if failed
    if (
      localFilePath &&
      fs.existsSync(localFilePath)
    ) {
      fs.unlinkSync(localFilePath);
    }

    console.log(error);

    return null;
  }
};

module.exports = {uploadOnS3}