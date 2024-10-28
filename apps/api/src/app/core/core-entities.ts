import { Permission } from "../module/permission/permission.entity";
import { Role } from "../module/role/role.entity";
import { User } from "../module/user";
import { Verification } from "../module/user/verification.entity";

export const entities = [
    Role,
    Permission,
    User,
    Verification,
]
