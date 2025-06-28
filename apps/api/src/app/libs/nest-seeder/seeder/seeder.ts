import {
    Provider,
    Type,
    DynamicModule,
    ForwardReference,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import yargs from 'yargs';

import { SeederServiceOptions } from './seeder.interface';
import {
    SeederModule,
    SeederModuleExtraOptions,
    SeederModuleOptions,
} from './seeder.module';
import { SeederService } from './seeder.service';


export interface SeederOptions {
    imports?: Array<
        Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    providers?: Provider[];
}

export interface SeederRunner {
    run(extraOptions: SeederModuleExtraOptions): Promise<void>;
}

async function bootstrap(options: SeederModuleOptions) {
    const app = await NestFactory.createApplicationContext(
        SeederModule.register(options),
    );

    const seedersService = app.get(SeederService);
    await seedersService.run();

    await app.close();
}

export const seeder = (options: SeederOptions): SeederRunner => {
    return {
        run(extraOptions: SeederModuleExtraOptions): Promise<void> {
            const cliOptions: SeederServiceOptions = {};
            const argv:any = yargs(process.argv).argv;
            if (argv.r || argv.refresh) {
                cliOptions.refresh = true;
            }

            if (argv.n || argv.name) {
                cliOptions.name = argv.n || argv.name;
            }

            if (argv.d || argv.dummyData) {
                cliOptions.dummyData = argv.d || argv.dummyData;
            }

            extraOptions = Object.assign(extraOptions, cliOptions);

            return bootstrap({
                ...options,
                ...extraOptions,
            });
        },
    };
};
