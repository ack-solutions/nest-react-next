import { NestFactory } from '@nestjs/core';
import { SeederModule, SeederModuleExtraOptions, SeederModuleOptions } from './seeder.module';
import { SeederService } from './seeder.service';
import {
  Provider,
  Type,
  DynamicModule,
  ForwardReference,
} from '@nestjs/common';
import yargs from 'yargs';
import { SeederServiceOptions } from './seeder.interface';

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
    SeederModule.register(options)
  );

  const seedersService = app.get(SeederService);
  await seedersService.run();

  await app.close();
}

function parseOptionsFromCLI() {
  const options: SeederServiceOptions = {};
  const argv = yargs(process.argv).argv
  if (argv['r'] || argv['refresh']) {
    options.refresh = true;
  }

  if (argv['n'] || argv['name']) {
    options.name = argv['n'] || argv['name'];
  }

  if (argv['d'] || argv['dummyData']) {
    options.dummyData = argv['d'] || argv['dummyData'];
  }

  return options;
}

export const seeder = (options: SeederOptions): SeederRunner => {
  return {
    run(extraOptions: SeederModuleExtraOptions): Promise<void> {

      const cliOptions = parseOptionsFromCLI();
      extraOptions = Object.assign(extraOptions, cliOptions);

      return bootstrap({
        ...options,
        ...extraOptions
      });
    },
  };
};
