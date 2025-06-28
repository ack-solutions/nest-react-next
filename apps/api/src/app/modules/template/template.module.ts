import { NestAuthModule } from '@ackplus/nest-auth';
import { forwardRef, Module } from '@nestjs/common';

import { TemplateLayoutController } from './template-layout.controller';
import { TemplateLayoutService } from './template-layout.service';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';


@Module({
    imports: [forwardRef(() => NestAuthModule)],
    controllers: [TemplateLayoutController, TemplateController],
    providers: [TemplateLayoutService, TemplateService],
    exports: [TemplateLayoutService, TemplateService],
})
export class TemplateModule { }
