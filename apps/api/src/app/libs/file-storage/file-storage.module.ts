import { Module, DynamicModule, Provider } from '@nestjs/common';

import { FILE_STORAGE_OPTIONS } from './constants';
import { FileStorageService } from './file-storage.service';
import { FileStorageAsyncOptions, FileStorageModuleOptions } from './types';


@Module({})
export class FileStorageModule {

    static forRoot(options: FileStorageModuleOptions): DynamicModule {
        return {
            module: FileStorageModule,
            providers: [
                {
                    provide: FILE_STORAGE_OPTIONS,
                    useFactory: async () => {
                        FileStorageService.setOptions(options); // ✅ Store globally
                        return options;
                    },
                    inject: [],
                },
                FileStorageService,
            ],
            exports: [],
        };
    }

    static forRootAsync(options: FileStorageAsyncOptions): DynamicModule {
        const asyncProviders: Provider[] = [
            {
                provide: FILE_STORAGE_OPTIONS,
                useFactory: async (...args: any[]) => {
                    const fileStorageOptions = await options.useFactory(...args); // ✅ Fetch options dynamically
                    FileStorageService.setOptions(fileStorageOptions); // ✅ Store globally
                    return fileStorageOptions;
                },
                inject: options.inject || [],
            },
        ];

        return {
            module: FileStorageModule,
            imports: options.imports || [],
            providers: [...asyncProviders],
            exports: [],
        };
    }

}
