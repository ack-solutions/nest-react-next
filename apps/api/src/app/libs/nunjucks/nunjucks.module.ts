import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import * as nunjucks from 'nunjucks';

import { NunjucksAsyncOptions, NunjucksModuleOptions, NunjucksOptionsFactory } from './nunjucks-options.interface';
import { NUNJUCKS_ENV, NUNJUCKS_OPTIONS } from './nunjucks.constants';
import { NunjucksService } from './nunjucks.service';


@Global()
@Module({})
export class NunjucksModule {

    /**
     * Register the module synchronously.
     */
    static forRoot(options: NunjucksModuleOptions): DynamicModule {
        const syncProviders: Provider[] = [
            {
                provide: NUNJUCKS_OPTIONS,
                useValue: options,
            },
        ];
        return this.createDynamicModule(syncProviders);
    }

    /**
     * Register the module asynchronously.
     */
    static forRootAsync(options: NunjucksAsyncOptions): DynamicModule {
        const asyncProviders: Provider[] = [...this.createAsyncProviders(options)];
        return this.createDynamicModule(asyncProviders, options.imports);
    }

    /**
     * Create the DynamicModule with common logic.
     */
    private static createDynamicModule(providers: Provider[], imports: any[] = []): DynamicModule {
        const commonProviders: Provider[] = [
            {
                provide: NUNJUCKS_ENV,
                useFactory: (options: NunjucksModuleOptions) => {
                    const env = nunjucks.configure(options.viewsDir, {
                        autoescape: options.autoescape ?? true,
                        noCache: options.noCache ?? process.env.NODE_ENV === 'development',
                    });

                    if (options.extendEnvironment) {
                        options.extendEnvironment(env);
                    }

                    return env;
                },
                inject: [NUNJUCKS_OPTIONS],
            },
            NunjucksService,
        ];

        return {
            module: NunjucksModule,
            imports,
            providers: [...providers, ...commonProviders],
            exports: [
                NUNJUCKS_OPTIONS,
                NUNJUCKS_ENV,
                NunjucksService,
            ],
        };
    }

    /**
     * Create providers for asynchronous options.
     */
    private static createAsyncProviders(options: NunjucksAsyncOptions): Provider[] {
        if (options.useFactory) {
            return [
                {
                    provide: NUNJUCKS_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
            ];
        }

        let useClassProvider;
        if (options.useClass) {
            useClassProvider = {
                provide: options.useClass,
                useClass: options.useClass,
            };
        }

        return [
            {
                provide: NUNJUCKS_OPTIONS,
                useFactory: async (optionsFactory: NunjucksOptionsFactory) => optionsFactory.createNunjucksOptions(),
                inject: [options.useExisting || options.useClass],
            },
            ...(useClassProvider ? [useClassProvider] : []),
        ];
    }

}
