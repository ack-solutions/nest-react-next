import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CountryController } from './country.controller';
import { Country } from './country.entity';
import { CountryService } from './country.service';


@Module({
    imports: [TypeOrmModule.forFeature([Country]), NestAuthModule],
    providers: [CountryService, ConfigModule],
    controllers: [CountryController],
    exports: [CountryService],
})
export class CountryModule { }
