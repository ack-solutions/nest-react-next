import { FileStorageEnum } from '@ackplus/nest-file-storage';
import { registerAs } from '@nestjs/config';

export interface IStorageConfig {
    type: FileStorageEnum;
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    cloudFrontUrl: string;
}

export default registerAs('storage', () => ({
    type: process.env.STORAGE_TYPE,
    endpoint: process.env.AWS_S3_ENDPOINT,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET,
    cloudFrontUrl: process.env.AWS_CDN_URL,
}));
