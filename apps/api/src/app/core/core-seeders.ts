import { PermissionSeeder } from "../module/permission/permission.seed";
import { RoleSeeder } from "../module/role/role.seed";
import { UserSeeder } from "../module/user/user.seed";

export const seeders = [
    RoleSeeder,
    PermissionSeeder,
    UserSeeder
]
