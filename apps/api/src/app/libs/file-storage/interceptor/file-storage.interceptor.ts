import { NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import multer from 'multer';
import { Observable } from 'rxjs';

import { FileStorageService } from '../file-storage.service';
import { StorageFactory } from '../storage.factory';
import { FileStorageEnum, StorageOptions } from '../types';


export type FileUploadConfig = {
    type: 'single' | 'array' | 'fields';
    fieldName?: string;
    maxCount?: number;
    fields?: { name: string; maxCount?: number }[];
};

export type FileStorageInterceptorOptions = {
    fileName?: (file: any, req?: Request) => string;
    fileDist?: (file: any, req?: Request) => string;
    prefix?: string;
    storageType?: FileStorageEnum;
    storageOptions?: StorageOptions;
    validateFileType?: (file: Express.Multer.File, req: any) => void;
    fileLimit?: (request) => number;
};

/**
 * Function-based interceptor that accepts storage options dynamically.
 */
export function FileStorageInterceptor(
    fileConfig: FileUploadConfig | string,
    interceptorOptions?: FileStorageInterceptorOptions,
): NestInterceptor {
    if (typeof fileConfig === 'string') {
        fileConfig = {
            type: 'single',
            fieldName: fileConfig,
        };
    }

    return {
        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            const options = FileStorageService.getOptions();
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();

            // Determine storage type
            const storageType = interceptorOptions?.storageType ?? options.storage;
            const storageOptions = {
                ...options[`${storageType}Config`],
                ...(interceptorOptions?.storageOptions || {}),
                fileName: interceptorOptions?.fileName || options[`${storageType}Config`].fileName,
                // fileDist: interceptorOptions?.fileDist || options[`${storageType}Config`].fileDist,
                fileDist: (file: any, req) => {
                    if (interceptorOptions?.fileDist) {
                        return interceptorOptions.fileDist(file, req);
                    }
                    return options[`${storageType}Config`].fileDist?.(file, req);
                },
                prefix: interceptorOptions?.prefix || options[`${storageType}Config`].prefix,
            };

            // Create storage instance dynamically
            const storage = StorageFactory.createStorage(storageType, storageOptions);
            const multerInstance = multer({
                storage,
                fileFilter: (req, file, callback) => {
                    try {
                        if (interceptorOptions?.validateFileType) {
                            interceptorOptions.validateFileType(file, req);
                        }
                        callback(null, true);
                    } catch (err) {
                        // Save the error in request to reject the entire upload
                        (req as any).fileValidationError = err;
                        callback(err, false);
                    }
                },
                limits: {
                    fileSize: interceptorOptions?.fileLimit(request) || 1024 * 1024 * 20, // 20MB
                },
            });

            // Multer setup based on fileConfig
            let multerMiddleware;
            switch (fileConfig.type) {
                case 'single':
                    if (!fileConfig.fieldName) {
                        throw new Error('fieldName is required for single file upload.');
                    }
                    multerMiddleware = multerInstance.single(fileConfig.fieldName);
                    break;
                case 'array':
                    if (!fileConfig.fieldName) {
                        throw new Error('fieldName is required for multiple file upload.');
                    }
                    multerMiddleware = multerInstance.array(fileConfig.fieldName, fileConfig.maxCount);
                    break;
                case 'fields':
                    if (!fileConfig.fields || !Array.isArray(fileConfig.fields)) {
                        throw new Error('fields array is required for multiple fields file upload.');
                    }
                    multerMiddleware = multerInstance.fields(fileConfig.fields);
                    break;
                default:
                    throw new Error('Invalid file upload type. Use "single", "array", or "fields".');
            }

            // Run multer middleware
            await new Promise<void>((resolve, reject) => {
                multerMiddleware(request, response, (err) => {
                    if ((request as any).fileValidationError) {
                        return reject((request as any).fileValidationError);
                    }
                    if (err?.code === 'LIMIT_FILE_SIZE') {
                        return reject(new BadRequestException(`File too large. Max allowed size is ${interceptorOptions?.fileLimit(request) / 1024 / 1024}MB.`));
                    }
                    if (err) {
                        return reject(new BadRequestException(err.message || 'File upload error'));
                    }
                    return resolve();
                });
            });

            return next.handle();
        },
    };
}
