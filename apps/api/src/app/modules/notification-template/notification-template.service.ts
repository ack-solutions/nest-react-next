import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '@api/app/core/crud';
import { INotificationTemplate } from '@libs/types';
import { NotificationTemplate } from './notification-template.entity';

@Injectable()
export class NotificationTemplateService extends CrudService<INotificationTemplate> {
    constructor(
    @InjectRepository(NotificationTemplate)
        repository: Repository<NotificationTemplate>
    ) {
        super(repository);
    }
}
