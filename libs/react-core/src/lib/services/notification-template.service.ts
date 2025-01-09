import { INotificationTemplate } from '@libs/types';

import { CRUDService } from './crud-service';


export class NotificationTemplateService extends CRUDService<INotificationTemplate> {

    protected apiPath = 'notification-template';


}
