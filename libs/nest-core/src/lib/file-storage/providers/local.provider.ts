// import { FileStorageOption, UploadedFile } from '../types/file-provider';
// import * as multer from 'multer';
// import * as fs from 'fs';
// import * as moment from 'moment';
// import { Provider } from './provider';
// import { basename, join, resolve } from 'path';
// import { getEnv } from '@mlm/nest-core';


// export class LocalProvider extends Provider<LocalProvider> {
// 	static instance: LocalProvider;
// 	name = 'local';
// 	tenantId = '';
// 	config = {
// 		rootPath: resolve(process.cwd(), 'public'),
// 		baseUrl: getEnv('APP_URL', '') + '/public'
// 	};

// 	// getConfig(key?: string) {
// 	// 	const config = {
// 	// 		rootPath: resolve(process.cwd(), 'public'),
// 	// 		baseUrl: getEnv('APP_URL', '') + '/public'
// 	// 	};
// 	// 	return key ? config[key] : config
// 	// }

// 	getInstance() {
// 		if (!LocalProvider.instance) {
// 			LocalProvider.instance = new LocalProvider();
// 		}
// 		return LocalProvider.instance;
// 	}

// 	url(filePath: string) {
// 		if (filePath && filePath.startsWith('http')) {
// 			return filePath;
// 		}
// 		return filePath ? `${this.getConfig('baseUrl')}/${filePath}` : null;
// 	}

// 	path(filePath: string) {
// 		return filePath ? `${this.getConfig('rootPath')}/${filePath}` : null;
// 	}

// 	handler({
// 		dest,
// 		filename,
// 		prefix
// 	}: FileStorageOption): multer.StorageEngine {
// 		return multer.diskStorage({
// 			destination: (_req, file, callback) => {
// 				let dir;
// 				if (dest instanceof Function) {
// 					dir = dest(file);
// 				} else {
// 					dir = dest;
// 				}

// 				const fullPath = join(
// 					this.config.rootPath,
// 					dir
// 				);

// 				fs.mkdirSync(fullPath, {
// 					recursive: true
// 				});

// 				callback(null, fullPath);
// 			},
// 			filename: (_req, file, callback) => {
// 				let fileNameString = '';
// 				const ext = file.originalname.split('.').pop();
// 				if (filename) {
// 					if (typeof filename === 'string') {
// 						fileNameString = filename;
// 					} else {
// 						fileNameString = filename(file, ext);
// 					}
// 				} else {
// 					// fileNameString = `${prefix}-${moment().unix()}-${parseInt(
// 					// 	'' + Math.random() * 1000,
// 					// 	10
// 					// )}.${ext}`;
// 				}
// 				callback(null, fileNameString);
// 			}
// 		});
// 	}

// 	// async getFile(file: string): Promise<Buffer> {
// 	// 	return await fs.promises.readFile(this.path(file));
// 	// }

// 	// async deleteFile(file: string): Promise<void> {
// 	// 	return await fs.promises.unlink(this.path(file));
// 	// }

// 	async putFile(
// 		fileContent: string | Buffer,
// 		path = ''
// 	): Promise<UploadedFile> {
// 		return new Promise((putFileResolve, reject) => {
// 			const fullPath = join(this.config.rootPath, path);
// 			fs.mkdirSync(fullPath, { recursive: true });
// 			fs.writeFile(fullPath, fileContent, (err) => {
// 				if (err) {
// 					reject(err);
// 					return;
// 				}

// 				const stats = fs.statSync(fullPath);
// 				const baseName = basename(path);
// 				const file = {
// 					originalname: baseName, // orignal file name
// 					size: stats.size, // files in bytes
// 					filename: baseName,
// 					path: fullPath // Full path of the file
// 				};
// 				putFileResolve(this.mapUploadedFile(file));
// 			});
// 		});
// 	}

// 	// mapUploadedFile(file): UploadedFile {
// 	// 	const separator = process.platform === 'win32' ? '\\' : '/';
	
// 	// 	if (file) {
// 	// 		if (file.path) {
// 	// 			file.key = file.path.replace(this.config.rootPath + separator, '');
// 	// 		}
// 	// 		file.url = this.url(file.key);
// 	// 		return file;
// 	// 	}else{
// 	// 		return null;
// 	// 	}
// 	// }
// }