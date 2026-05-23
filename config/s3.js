const dotenv = require('dotenv').config()
const  { S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.AWS_ASSESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
     forcePathStyle: true,
})

module.exports = s3