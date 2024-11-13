import { PermissionSeeder } from "../module/permission/permission.seeder";
import { RoleSeeder } from "../module/role/role.seeder";
import { UserSeeder } from "../module/user/user.seeder";

export const AllSeeders = [
    RoleSeeder,
    PermissionSeeder,
    UserSeeder
]
