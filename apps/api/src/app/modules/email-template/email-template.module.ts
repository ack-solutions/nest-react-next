import { NestAuthModule } from '@ackplus/nest-auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailTemplateController } from './email-template.controller';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateService } from './email-template.service';


@Module({
    imports: [TypeOrmModule.forFeature([EmailTemplate]), NestAuthModule],
    controllers: [EmailTemplateController],
    providers: [EmailTemplateService],
    exports: [EmailTemplateService],
})
export class EmailTemplateModule { }
