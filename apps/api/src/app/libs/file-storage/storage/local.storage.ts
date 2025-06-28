import concat from 'concat-stream';
import * as fs from 'fs';
import moment from 'moment';
import { StorageEngine } from 'multer';
import * as path from 'path';
import { basename, dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { LocalStorageOptions, Storage, UploadedFile } from '../types';


export class LocalStorage implements StorageEngine, Storage {

    private rootPath: string;
    private fileNameFunction: (file: Express.Multer.File, req?: any) => string | Promise<string>;
    private fileDistFunction: (file: Express.Multer.File, req?: any) => string | Promise<string>;

    constructor(private options: LocalStorageOptions) {
        this.rootPath = options.rootPath || path.join(process.cwd(), 'public');

        this.fileNameFunction = options.fileName || ((file, _req) => {
            return `${uuidv4()}-${file.originalname}`;
        });

        this.fileDistFunction = options.fileDist || ((_file, _req) => {
            return path.join(this.rootPath, moment().format('YYYY'), moment().format('MM'), moment().format('DD'));
        });


        // Ensure the rootPath directory exists
        if (!fs.existsSync(this.rootPath)) {
            fs.mkdirSync(this.rootPath, { recursive: true });
        }
    }

    async _handleFile(
        req: any,
        file: Express.Multer.File,
        cb: (error?: any, info?: any) => void,
    ) {
        try {
            const dist = await this.fileDistFunction(file, req);
            const key = await this.fileNameFunction(file, req);

            const filePath = join(dist, key);
            file.stream.pipe(concat({ encoding: 'buffer' }, async (buffer) => {
                const uploadedFile = await this.putFile(buffer, filePath);

                const fileInfo: UploadedFile = {
                    ...uploadedFile,
                    fieldName: file.fieldname,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                };
                let transformData = fileInfo;

                if (this.options?.transformUploadedFileObject) {
                    transformData = await this.options.transformUploadedFileObject(fileInfo);
                }
                cb(null, transformData);
            }));
        } catch (error) {
            console.error('error', error);
            cb(error);
        }
    }

    _removeFile(
        _req: any,
        file,
        cb: (error: Error | null) => void,
    ) {
        const filePath = file.path;

        fs.unlink(filePath, (err) => {
            if (err) {
                cb(err);
            } else {
                cb(null);
            }
        });
    }

    getUrl(filePath: string) {
        if (filePath && filePath.startsWith('http')) {
            return filePath;
        }
        return filePath ? `${this.options.baseUrl}/${filePath}` : null;
    }

    async getFile(file: string): Promise<Buffer> {
        return fs.promises.readFile(this.path(file));
    }

    async deleteFile(file: string): Promise<void> {
        return fs.promises.unlink(this.path(file));
    }

    async putFile(
        fileContent: Buffer,
        key: string,
    ): Promise<UploadedFile> {
        return new Promise((putFileResolve, reject) => {
            const path = join(this.options.rootPath, key);

            const directoryPath = dirname(path); // Extract the directory part

            // Create the directory if it doesn't exist
            fs.mkdirSync(directoryPath, { recursive: true });


            //  fs.mkdirSync(path, { recursive: true });
            fs.writeFile(path, fileContent, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const stats = fs.statSync(path);
                const baseName = basename(key);
                const fileInfo = {
                    originalName: baseName, // original file name
                    size: stats.size, // files in bytes
                    fileName: baseName,
                    key,
                    path, // Full path of the file
                    url: this.getUrl(key),
                };
                putFileResolve(fileInfo);
            });
        });
    }


    path(filePath: string) {
        return filePath ? `${this.options.rootPath}/${filePath}` : null;
    }

    async copyFile(oldKey: string, newKey: string): Promise<UploadedFile> {
        return new Promise((resolve, reject) => {
            const oldPath = join(this.options.rootPath, oldKey);
            const newPath = join(this.options.rootPath, newKey);

            const directoryPath = dirname(newPath);
            fs.mkdirSync(directoryPath, { recursive: true });

            fs.copyFile(oldPath, newPath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const stats = fs.statSync(newPath);
                const baseName = basename(newKey);
                const fileInfo: UploadedFile = {
                    originalName: baseName,
                    size: stats.size,
                    fileName: baseName,
                    key: newKey,
                    path: newPath,
                    url: this.getUrl(newKey),
                };
                resolve(fileInfo);
            });
        });
    }


}
