import { CountrySeeder } from './seeder/country.seed';
import { PageSeeder } from './seeder/page.seed';
import { PermissionSeeder } from './seeder/permisstion.seed';
import { RoleSeeder } from './seeder/role.seed';
import { UserSeeder } from './seeder/user.seed';
import { EmailTemplateSeeder } from './seeder/template.seed';


export interface SeederMetadata {
    name: string;
    key: string;
    description?: string;
}

export const ALL_SEEDERS = [
    CountrySeeder,
    PermissionSeeder,
    RoleSeeder,
    UserSeeder,
    PageSeeder,
    EmailTemplateSeeder,
];

export const SEEDER_METADATA: SeederMetadata[] = [
    {
        name: 'Country Seeder',
        key: 'country',
        description: 'Seeds country data for dropdowns and location features',
    },
    {
        name: 'Permission Seeder',
        key: 'permission',
        description: 'Seeds all application permissions for role-based access control',
    },
    {
        name: 'Role Seeder',
        key: 'role',
        description: 'Seeds default roles (Super Admin, Admin, Manager, etc.)',
    },
    {
        name: 'User Seeder',
        key: 'user',
        description: 'Seeds default admin users for initial access',
    },
    {
        name: 'Page Seeder',
        key: 'page',
        description: 'Seeds CMS pages and content',
    },
    {
        name: 'Email Template Seeder',
        key: 'email-template',
        description: 'Seeds email templates (welcome, OTP, password reset, notifications, etc.)',
    },
];
