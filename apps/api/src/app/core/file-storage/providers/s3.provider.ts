import { S3Client, GetObjectCommand, GetObjectCommandInput, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import moment from 'moment';
import { StorageEngine } from 'multer';
import multerS3 from 'multer-s3';
import { basename, join } from 'path';

import { FileStorageOption } from '../types';
import { Provider } from './provider';


export interface S3Config {
    rootPath: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_default_region: string;
    aws_bucket: string;
    aws_endpoint: string;
}

export class S3Provider extends Provider<S3Provider> {

    static instance: S3Provider;

    name = 's3';
    tenantId: string;

    config: S3Config;
    defaultConfig: S3Config;

    fetchSetting = false;

    constructor() {
        super();
        const awsConfig = {
            aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
            aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
            aws_default_region: process.env.AWS_REGION || 'us-east-1',
            aws_bucket: process.env.AWS_S3_BUCKET || 'cleardoor-dev',
            aws_endpoint:
                process.env.AWS_ENDPOINT ||
                'https://strive.fra1.digitaloceanspaces.com',
        };
        this.config = this.defaultConfig = {
            rootPath: '',
            ...awsConfig,
        };
    }

    getInstance() {
        if (!S3Provider.instance) {
            S3Provider.instance = new S3Provider();
        }
        this.setAwsDetails();
        return S3Provider.instance;
    }

    async url(key: string, objectConfig?: Partial<GetObjectCommandInput>) {
        if (key) {
            const url = await getSignedUrl(
                this.getS3Instance(),
                new GetObjectCommand({
                    Bucket: this.getS3Bucket(),
                    Key: key,
                    ...objectConfig && { ...objectConfig },
                }),
            );
            // Adjustable expiration.
            // const url = this.getS3Instance().getSignedUrl('getObject', {
            // 	Bucket: this.getS3Bucket(),
            // 	Key: key,
            // 	Expires: 3600
            // });
            return url;
        }
        return null;
    }

    setAwsDetails() {
        this.config = {
            ...this.defaultConfig,
        };
    }

    path(filePath: string) {
        return filePath ? this.config.rootPath + '/' + filePath : null;
    }

    handler({ dest, filename, prefix }: FileStorageOption): StorageEngine {
        return multerS3({
            s3: this.getS3Instance() as any,
            bucket: this.getS3Bucket(),
            metadata: function (_req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: (_req, file, callback) => {
                let fileNameString = '';
                if (file) {
                    const ext = file.originalname.split('.').pop();
                    if (filename) {
                        if (typeof filename === 'string') {
                            fileNameString = filename;
                        } else {
                            fileNameString = filename(file, ext);
                        }
                    } else {
                        fileNameString = `cleardoor-${prefix}-${moment().unix()}-${parseInt(
                            '' + Math.random() * 1000,
                            10,
                        )}.${ext}`;
                    }
                    let dir;
                    if (dest instanceof Function) {
                        dir = dest(file);
                    } else {
                        dir = dest;
                    }
                    callback(
                        null,
                        join(this.config.rootPath, dir, fileNameString),
                    );
                }
            },
        });
    }

    async getFile(key: string): Promise<Buffer> {
        const s3 = this.getS3Instance();
        const params = {
            Bucket: this.getS3Bucket(),
            Key: key || (Math.random() + 1).toString(36).substring(12),
        };

        return (async () => {
            try {
                const command = new GetObjectCommand(params);
                const data = await s3.send(command);
                return data.Body as any;
            } catch (err) {
                throw err;
            }
        })();
        // const data = await s3.getObject(params).promise();
        // return data.Body as Buffer;
    }

    async putFile(fileContent: string, key = ''): Promise<any> {
        return new Promise(async (putFileResolve, reject) => {
            const fileName = basename(key);
            const s3 = this.getS3Instance();
            const params = {
                Bucket: this.getS3Bucket(),
                Body: fileContent,
                Key: key || (Math.random() + 1).toString(36).substring(12),
                ContentDisposition: `inline; ${fileName}`,
            };

            try {
                const putCommand = new PutObjectCommand(params);
                await s3.send(putCommand);

                const headCommand = new HeadObjectCommand({
                    Key: key,
                    Bucket: this.getS3Bucket(),
                });
                const sizeResult = await s3.send(headCommand);
                const size = sizeResult.ContentLength;

                const file = {
                    originalname: fileName, // original file name
                    size: size, // files in bytes
                    filename: fileName,
                    path: key, // Full path of the file
                    key: key, // Full path of the file
                };
                const res = await this.mapUploadedFileData(file);
                putFileResolve(res);
            } catch (err) {
                reject(err);
            }
        });
    }

    deleteFile(key: string): Promise<void> {
        const s3 = this.getS3Instance();
        const params = {
            Bucket: this.getS3Bucket(),
            Key: key || (Math.random() + 1).toString(36).substring(12),
        };
        return new Promise(async (deleteFileResolve, reject) => {
            try {
                const deleteCommand = new DeleteObjectCommand(params);
                await s3.send(deleteCommand);
                deleteFileResolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    private getS3Instance() {
        this.setAwsDetails();

        const s3Client = new S3Client({
            forcePathStyle: true, // Configures to use subdomain/virtual calling format.
            endpoint: this.config.aws_endpoint,
            region: this.config.aws_default_region,
            credentials: {
                accessKeyId: this.config.aws_access_key_id,
                secretAccessKey: this.config.aws_secret_access_key,
            },
        });
        return s3Client;
        // return new AWS.S3({
        // 	accessKeyId: this.config.aws_access_key_id,
        // 	secretAccessKey: this.config.aws_secret_access_key,
        // 	region: this.config.aws_default_region
        // });
    }

    getS3Bucket() {
        this.setAwsDetails();
        // return {
        // 	Bucket: this.config.aws_bucket,
        // 	Key: "file.ext"
        // };
        return this.config.aws_bucket;
    }

    async mapUploadedFileData(file): Promise<any> {
        if (file) {
            file.filename = file?.originalname;
            file.url = await this.url(file.key); // file.location;
            return file;
        }
        return null;
    }

}
