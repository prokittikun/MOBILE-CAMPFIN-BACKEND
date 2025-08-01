import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_AccessKey,
    secretAccessKey: process.env.S3_SecretKey,
  },
  endpoint: process.env.S3_URL,
  forcePathStyle: true,
  region: 'ap-southeast-1',
});
