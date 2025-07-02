import { CountrySeeder } from './seeder/country.seed';
import { PageSeeder } from './seeder/page.seed';
import { RoleSeeder } from './seeder/role.seed';
import { TenantSeeder } from './seeder/tenant.seed';
import { UserSeeder } from './seeder/user.seed';


export const ALL_SEEDERS = [
    TenantSeeder,
    CountrySeeder,
    RoleSeeder,
    UserSeeder,
    PageSeeder,
];
