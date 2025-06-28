import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Country } from './country.entity';
import { CountrySearchInputDTO } from './dto/country-search-input.dto';


@Injectable()
export class CountryService {

    constructor(
        @InjectRepository(Country)
        public readonly countryRepository: Repository<Country>,
    ) {

    }

    async searchCountry(params: CountrySearchInputDTO) {
        return this.countryRepository.find({
            ...(params.search ? {
                where: {
                    country: ILike(`%${params.search}%`),
                },
            } : {}),
            order: {
                country: 'ASC',
            },
        });
    }

}
