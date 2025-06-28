import { PartialType } from '@nestjs/swagger';

import { EmailTemplate } from '../email-template.entity';


export class EmailTemplateDTO extends PartialType(EmailTemplate) { }
