import { CountrySeeder } from './seeder/country.seed';
import { PageSeeder } from './seeder/page.seed';
import { PermissionSeeder } from './seeder/permisstion.seed';
import { RoleSeeder } from './seeder/role.seed';
import { UserSeeder } from './seeder/user.seed';


export const ALL_SEEDERS = [
    CountrySeeder,
    PermissionSeeder,
    RoleSeeder,
    UserSeeder,
    PageSeeder,
];
