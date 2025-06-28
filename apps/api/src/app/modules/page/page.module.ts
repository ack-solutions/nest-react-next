import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PageController } from './page.controller';
import { Page } from './page.entity';
import { PageService } from './page.service';


@Module({
    imports: [TypeOrmModule.forFeature([Page]), NestAuthModule],
    controllers: [PageController],
    providers: [PageService],
    exports: [PageService],
})
export class PageModule { }
