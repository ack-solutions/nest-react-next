import { NotificationTemplate } from "../modules/notification-template/notification-template.entity";
import { Page } from "../modules/page/page.entity";
import { Permission } from "../modules/permission/permission.entity";
import { Role } from "../modules/role/role.entity";
import { Setting } from "../modules/setting/setting.entity";
import { User } from "../modules/user";
import { Verification } from "../modules/user/verification.entity";

export const AllEntities = [
    Role,
    Permission,
    User,
    Verification,
    NotificationTemplate,
    Setting,
    Page
]
