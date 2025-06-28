import { ICountrySearchInput } from '@libs/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class CountrySearchInputDTO implements ICountrySearchInput {

    @ApiPropertyOptional({ description: 'Search term for country' })
    @IsOptional()
    @IsString()
    search?: string;

}
