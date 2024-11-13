import { FileStorageOption } from '../types';
import multerS3 from 'multer-s3';
import { basename, join } from 'path';
import moment from 'moment';
import { StorageEngine } from 'multer';
import { Provider } from './provider';
import { S3 as AWS_S3, GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
					...objectConfig && { ...objectConfig }
				}),
			);
			// Adjustable expiration.
			// const url = this.getS3Instance().getSignedUrl('getObject', {
			// 	Bucket: this.getS3Bucket(),
			// 	Key: key,
			// 	Expires: 3600
			// });
			return url;
		} else {
			return null;
		}
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
			s3: this.getS3Instance(),
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
							10
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
						join(this.config.rootPath, dir, fileNameString)
					);
				}
			},
		});
	}

	async getFile(key: string): Promise<Buffer> {
		const s3 = this.getS3Instance();
		const params = {
			Bucket: this.getS3Bucket(),
			Key: key ? key : (Math.random() + 1).toString(36).substring(12),
		};

		return new Promise((resolve, reject) => {
			s3.getObject(params, (err, data) => {
				if (err) reject(err);
				else resolve(data.Body as Buffer);
			});
		});
		// const data = await s3.getObject(params).promise();
		// return data.Body as Buffer;
	}

	async putFile(fileContent: string, key = ''): Promise<any> {
		return new Promise(async (putFileResolve, reject) => {
			const fileName = basename(key);
			const s3 = await this.getS3Instance();
			const params = {
				Bucket: this.getS3Bucket(),
				Body: fileContent,
				Key: key ? key : (Math.random() + 1).toString(36).substring(12),
				ContentDisposition: `inline; ${fileName}`,
			};

			s3.putObject(params, async (err) => {
				if (err) {
					reject(err);
				} else {
					const size = await s3
						.headObject({ Key: key, Bucket: this.getS3Bucket() })
						//.promise()
						.then((res) => res.ContentLength);

					const file = {
						originalname: fileName, // original file name
						size: size, // files in bytes
						filename: fileName,
						path: key, // Full path of the file
						key: key, // Full path of the file
					};
					const res = await this.mapUploadedFileData(file);
					await putFileResolve(res);
				}
			});
		});
	}

	deleteFile(key: string): Promise<void> {
		const s3 = this.getS3Instance();
		const params = {
			Bucket: this.getS3Bucket(),
			Key: key ? key : (Math.random() + 1).toString(36).substring(12),
		};
		return new Promise((deleteFileResolve, reject) => {
			s3.deleteObject(params, function (err) {
				if (err) reject(err);
				else deleteFileResolve();
			});
		});
	}

	private getS3Instance() {
		this.setAwsDetails();

		const s3Client = new AWS_S3({
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
		} else {
			return null;
		}
	}
}
