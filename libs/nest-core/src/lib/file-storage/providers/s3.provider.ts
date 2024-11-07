// import { FileStorageOption, UploadedFile } from '../types/file-provider';
// import * as multerS3 from 'multer-s3';
// import { basename, join } from 'path';
// import * as moment from 'moment';
// import * as AWS from 'aws-sdk';
// import { StorageEngine } from 'multer';
// import { Provider } from './provider';

// export interface S3Config {
// 	rootPath: string;
// 	aws_access_key_id: string;
// 	aws_secret_access_key: string;
// 	aws_default_region: string;
// 	aws_bucket: string;
// }

// export class S3Provider extends Provider<S3Provider> {
// 	static instance: S3Provider;

// 	name = 's3';
// 	tenantId: string;

// 	config: S3Config;
// 	defaultConfig: S3Config;

// 	fetchSetting = false;

// 	constructor() {
// 		super();
// 		const awsConfig: any = {
// 			aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
// 			aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
// 			aws_default_region: process.env.AWS_DEFAULT_REGION,
// 			aws_bucket: process.env.AWS_BUCKET,
// 		}
// 		this.config = this.defaultConfig = {
// 			rootPath: '',
// 			...awsConfig,
// 		};
// 	}

// 	getInstance() {
// 		if (!S3Provider.instance) {
// 			S3Provider.instance = new S3Provider();
// 		}
// 		this.setAwsDetails();
// 		return S3Provider.instance;
// 	}

// 	url(key: string) {
// 		if (key) {
// 			const cloudFrontDomain = process.env.AWS_CLOUDFRONT_URL;
// 			let url;
// 			if (cloudFrontDomain) {
// 				url = `${cloudFrontDomain}/${key}`;
// 			} else {
// 				url = this.getS3Instance().getSignedUrl('getObject', {
// 					Bucket: this.getS3Bucket(),
// 					Key: key,
// 					Expires: 3600
// 				});

// 			}
// 			return url;
// 		}
// 		else {
// 			return null
// 		}
// 	}

// 	setAwsDetails() {
// 		this.config = {
// 			...this.defaultConfig
// 		};
// 	}

// 	path(filePath: string) {
// 		return filePath ? this.config.rootPath + '/' + filePath : null;
// 	}

// 	handler({ dest, filename, prefix }: FileStorageOption): StorageEngine {
// 		return multerS3({
// 			s3: this.getS3Instance(),
// 			bucket: this.getS3Bucket(),
// 			metadata: function (_req, file, cb) {
// 				cb(null, { fieldName: file.fieldname });
// 			},
// 			key: (_req, file, callback) => {
// 				let fileNameString = '';
// 				const ext = file.originalname.split('.').pop();
// 				if (filename) {
// 					if (typeof filename === 'string') {
// 						fileNameString = filename;
// 					} else {
// 						fileNameString = filename(file, ext);
// 					}
// 				} else {
// 					// fileNameString = `crm-${prefix}-${moment().unix()}-${parseInt(
// 					// 	'' + Math.random() * 1000,
// 					// 	10
// 					// )}.${ext}`;
// 				}
// 				let dir;
// 				if (dest instanceof Function) {
// 					dir = dest(file);
// 				} else {
// 					dir = dest;
// 				}
// 				callback(
// 					null,
// 					join(
// 						this.config.rootPath,
// 						dir,
// 						fileNameString
// 					)
// 				);
// 			}
// 		});
// 	}

// 	async getFile(key: string): Promise<Buffer> {
// 		const s3 = this.getS3Instance();
// 		const params = {
// 			Bucket: this.getS3Bucket(),
// 			Key: key
// 		};

// 		const data = await s3.getObject(params).promise();
// 		return data.Body as Buffer;
// 	}

// 	async putFile(fileContent: string, key = '', options?: any): Promise<any> {
// 		return new Promise((putFileResolve, reject) => {
// 			const fileName = basename(key);
// 			const s3 = this.getS3Instance();
// 			const params = {
// 				Bucket: this.getS3Bucket(),
// 				Body: fileContent,
// 				Key: key,
// 				ContentDisposition: `inline; ${fileName}`,
// 				...options,
// 			};

// 			s3.putObject(params, async (err) => {
// 				if (err) {
// 					reject(err);
// 				} else {
// 					const size = await s3
// 						.headObject({ Key: key, Bucket: this.getS3Bucket() })
// 						.promise()
// 						.then((res) => res.ContentLength);

// 					const file = {
// 						originalname: fileName, // orignal file name
// 						size: size, // files in bytes
// 						filename: fileName,
// 						path: key, // Full path of the file
// 						key: key // Full path of the file
// 					};
// 					putFileResolve(this.mapUploadedFile(file));
// 				}
// 			});
// 		});
// 	}

// 	deleteFile(key: string): Promise<void> {
// 		const s3 = this.getS3Instance();
// 		const params = {
// 			Bucket: this.getS3Bucket(),
// 			Key: key
// 		};
// 		return new Promise((deleteFileResolve, reject) => {
// 			s3.deleteObject(params, function (err) {
// 				if (err) reject(err);
// 				else deleteFileResolve();
// 			});
// 		});
// 	}

// 	private getS3Instance() {
// 		this.setAwsDetails();
// 		return new AWS.S3({
// 			accessKeyId: this.config.aws_access_key_id,
// 			secretAccessKey: this.config.aws_secret_access_key,
// 			region: this.config.aws_default_region
// 		});
// 	}

// 	getS3Bucket() {
// 		this.setAwsDetails();
// 		return this.config.aws_bucket;
// 	}

// 	mapUploadedFile(file): UploadedFile {
// 		if (file) {
// 			file.filename = file.originalname;
// 			file.url = this.url(file.key); // file.location;
// 			return file;
// 		} else {
// 			return null;
// 		}
// 	}
// }
