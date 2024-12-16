import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PageController } from './page.controller';
import { Page } from './page.entity';
import { PageService } from './page.service';


@Module({
    imports: [TypeOrmModule.forFeature([Page])],
    controllers: [PageController],
    providers: [PageService],
    exports: [],
})
export class PageModule { }
