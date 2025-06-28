import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';


@Module({
    imports: [TypeOrmModule.forFeature([]), NestAuthModule],
    controllers: [CmsController],
    providers: [CmsService],
    exports: [CmsService],
})
export class CmsModule { }
