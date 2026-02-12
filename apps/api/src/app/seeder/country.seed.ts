import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { BaseRepository } from '../core/typeorm/base-repository';
import { Seeder } from '@ackplus/nest-seeder';
import { Country } from '../modules/country/country.entity';


@Injectable()
export class CountrySeeder implements Seeder {

    constructor(
        @InjectRepository(Country)
        private countryRepository: BaseRepository<Country>,
    ) { }

    async seed() {
        await this.countryRepository.query(
            `TRUNCATE TABLE "${this.countryRepository.metadata.tableName}" CASCADE`,
        );
        const countriesFilePath = path.join(__dirname, 'data', 'countries.json');
        const rawData = fs.readFileSync(countriesFilePath, 'utf-8');
        const countries = JSON.parse(rawData);

        return this.countryRepository.save(countries);
    }

    drop() {
        return this.countryRepository.query(
            `TRUNCATE TABLE "${this.countryRepository.metadata.tableName}" CASCADE`,
        );
    }

}
