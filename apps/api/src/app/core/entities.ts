import { Permission } from '../modules/permission/permission.entity';
import { Role } from '../modules/role/role.entity';
import { User } from '../modules/user';
import { Verification } from '../modules/user/verification.entity';
import { Page } from '../modules/page/page.entity';
import { NotificationTemplate } from '../modules/notification-template/notification-template.entity';

export const AllEntities = [Role, Permission, User, Verification, Page, NotificationTemplate];
