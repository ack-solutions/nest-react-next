
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

type FileCategory = 'images' | 'documents' | 'spreadsheets' | 'presentations' | 'archives' | 'videos' | 'audio';


export const FILE_TYPE_CONFIG: Record<FileCategory, { types: string[] }> = {
    images: {
        types: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    },
    documents: {
        types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    },
    spreadsheets: {
        types: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    },
    presentations: {
        types: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    },
    archives: {
        types: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    },
    videos: {
        types: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
    },
    audio: {
        types: ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/ogg'],
    },
};



// (optional) if you want correct types, import FileUploadConfig type from your lib
type FileUploadConfig = { type: 'single' | 'array' | 'fields'; maxCount?: number; fields?: { name: string; maxCount?: number }[] };

function computeMaxFiles(fileConfig: FileUploadConfig): number | undefined {
    if (fileConfig.type === 'single') return 1;
    if (fileConfig.type === 'array') return fileConfig.maxCount ?? 10;
    if (fileConfig.type === 'fields') return (fileConfig.fields ?? []).reduce((s, f) => s + (f.maxCount ?? 1), 0);
    return undefined;
}

function getAllowedMimeTypes(fileTypes: FileCategory | FileCategory[] = null, extra?: { allowedMimeTypes?: string[] }) {
    if (extra?.allowedMimeTypes?.length > 0) {
        return extra.allowedMimeTypes;
    }
    if (fileTypes) {
        const types = Array.isArray(fileTypes) ? fileTypes : [fileTypes];
        return types.map(type => FILE_TYPE_CONFIG[type].types).flat();
    }
    return ['images', 'documents', 'spreadsheets', 'presentations', 'archives', 'videos', 'audio'];

}

/**
 *
 * @param fileTypes - The file types to validate (default: null)
 * @param maxMB - The maximum size of the file in MB (default: 50)
 * @param extra - The extra options to validate the file (default: null) e.g. { allowedMimeTypes: ['image/jpeg', 'image/png'] }
 * @returns
 */
export function projectPreUploadValidation(fileTypes: FileCategory | FileCategory[] = null, maxMB = 50, extra?: { allowedMimeTypes?: string[] }) {
    return {
        multerOptions: (req: Request, fileConfig: FileUploadConfig) => {
            const allowedMimeTypes = getAllowedMimeTypes(fileTypes, extra);
            const maxSizeBytes = (maxMB) * 1024 * 1024;
            const maxFiles = computeMaxFiles(fileConfig);

            return {
                limits: {
                    fileSize: maxSizeBytes,
                    ...(maxFiles ? { files: maxFiles } : {}),
                },
                fileFilter: (req2: Request, file: any, cb: any) => {
                    if (allowedMimeTypes.includes('*') || allowedMimeTypes.includes(file.mimetype)) {
                        return cb(null, true);
                    }
                    return cb(new BadRequestException('Invalid file type'), false);
                },
            };
        },
    };
}
