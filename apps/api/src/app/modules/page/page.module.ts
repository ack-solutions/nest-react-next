
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Page]),
    ],
    controllers: [PageController],
    providers: [PageService],
    exports: [PageService]
})
export class PageModule { }
