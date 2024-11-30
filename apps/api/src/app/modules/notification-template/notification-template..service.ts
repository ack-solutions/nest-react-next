import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { INotificationTemplate } from '@libs/types';
import { CrudService } from '@api/app/core/crud';
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
