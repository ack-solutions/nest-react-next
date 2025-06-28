import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmailTemplate } from './email-template.entity';
import { BaseService } from '../../core/service/base-service';


@Injectable()
export class EmailTemplateService extends BaseService<EmailTemplate> {

    constructor(
        @InjectRepository(EmailTemplate)
        repository: Repository<EmailTemplate>,
    ) {
        super(repository);
    }

}
