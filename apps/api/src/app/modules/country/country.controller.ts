import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Country } from './country.entity';
import { CountryService } from './country.service';
import { CountrySearchInputDTO } from './dto/country-search-input.dto';


@ApiTags('Country')
@Controller('country')
export class CountryController {

    constructor(private countryService: CountryService) {
    }

    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: [Country],
        description: 'Success',
    })
    @Get('country-search')
    async search(@Query() params: CountrySearchInputDTO) {
        return this.countryService.searchCountry(params);
    }

}
