import { Injectable } from '@nestjs/common';
import { Seeder, SeederServiceOptions } from './seeder.interface';

@Injectable()
export class SeederService {
  constructor(private readonly seeders: Seeder[], private readonly options: SeederServiceOptions = {}) {
  }

  async run(): Promise<any> {

    if (this.options.refresh) {
      await this.drop();
      await this.seed();
    } else {
      await this.seed();
    }

    return;
  }

  async seed(): Promise<any> {
    // Don't use `Promise.all` during insertion.
    // `Promise.all` will run all promises in parallel which is not what we want.
    const seeders = this.getSeederToRun();

    for (const seeder of seeders) {
      console.log(`${seeder.constructor.name} start`);
      console.log(`dummyData = ${this.options.dummyData ? 'true' : 'false'}`);

      await seeder.seed(this.options);
      console.log(`${seeder.constructor.name} completed`);
    }
  }

  async drop(): Promise<any> {
    const seeders = this.getSeederToRun();
    for (const seeder of seeders) {
      console.log(`Truncate ${seeder.constructor.name} start`);
      await seeder.drop(this.options);
      console.log(`Truncate ${seeder.constructor.name} completed`);
    }
  }

  getSeederToRun(): Seeder[] {

    if (this.options?.name && typeof this.options.name === 'string') {
      this.options.name = [this.options.name];
    }

    if (this.options.name) {
      const seeders = this.seeders.filter((s) => this.options.name?.indexOf(s.constructor.name) >= 0)
      if (seeders?.length === 0) {
        const allNames = this.seeders.map((s) => s.constructor.name);
        console.log('\x1b[43m', 'Warning : No Seeder Found.  Available Name are', '\x1b[0m', '\x1b[32m', '\n', `${allNames.join('\n')}`, '\x1b[0m');
        return [];
      } else {
        return seeders;
      }
    } else {
      if (this.seeders?.length === 0) {
        console.log('\x1b[43m', 'Warning : No seeders to run. Make sure you have passed default seeder', '\x1b[0m');
      }
      return this.seeders;
    }
  }
}
