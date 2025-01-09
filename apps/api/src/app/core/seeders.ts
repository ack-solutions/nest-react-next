import { PermissionSeeder } from '../modules/permission/permission.seeder';
import { RoleSeeder } from '../modules/role/role.seeder';
import { UserSeeder } from '../modules/user/user.seeder';


export const AllSeeders = [
    RoleSeeder,
    PermissionSeeder,
    UserSeeder,
];
