import { PartialType } from '@nestjs/swagger';
import { NotificationTemplate } from '../notification-template.entity';

export class NotificationTemplateDTO extends PartialType(
  NotificationTemplate
) {}
