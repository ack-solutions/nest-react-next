import { NestAuthAuthGuard } from '@ackplus/nest-auth';
import { Crud } from '@ackplus/nest-crud';
import { UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EmailTemplateDTO } from './dto/email-template.dto';
import { EmailTemplate } from './email-template.entity';
import { EmailTemplateService } from './email-template.service';


@ApiTags('Email Template')
@UseGuards(NestAuthAuthGuard)
@Crud({
    entity: EmailTemplate,
    name: 'EmailTemplate',
    path: 'email-template',
    softDelete: true,
    dto: {
        create: EmailTemplateDTO,
    },
})
export class EmailTemplateController {

    constructor(private service: EmailTemplateService) {
    }

}
