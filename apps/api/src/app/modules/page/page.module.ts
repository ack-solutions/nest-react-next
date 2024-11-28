import { Module } from '@nestjs/common';
import { Page } from './page.entity';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Page])],
    controllers: [PageController],
    providers: [PageService],
    exports: [],
})
export class PageModule {}
