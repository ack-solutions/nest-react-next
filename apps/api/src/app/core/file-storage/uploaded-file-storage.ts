import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { FileStorage } from './file-storage';
import { FileStorageProviderEnum, UploadedFile } from './types';


export const UploadedFileStorage = createParamDecorator(
    async (
        data: FileStorageProviderEnum,
        ctx: ExecutionContext,
    ): Promise<UploadedFile | any> => {
        const request = ctx.switchToHttp().getRequest();
        const provider = new FileStorage().getProvider(data);

        if (request.file) {
            const res = provider.mapUploadedFile(request.file);
            return provider.mapUploadedFile(res);
        } if (request.files) {
            if (request.files == Array) {
                return request.files.map(async (file) => {
                    return await provider.mapUploadedFile(file);
                });
            }
            const travel = { ...request.files };
            const result = [];

            for (const property in travel) {
                const res = await provider.mapUploadedFile(
                    travel[property],
                );
                if (res && Array.isArray(res)) {
                    result.push(res[0]);
                } else {
                    result.push(res);
                }
            }
            return result;
        }
    },
);
