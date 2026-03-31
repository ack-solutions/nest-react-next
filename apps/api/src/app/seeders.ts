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

export const SEEDERS_BY_KEY = {
    country: CountrySeeder,
    permission: PermissionSeeder,
    role: RoleSeeder,
    user: UserSeeder,
    page: PageSeeder,
    'email-template': EmailTemplateSeeder,
} as const;

// Keep this list to control what is exposed/run via the API + CLI config.
export const ENABLED_SEEDER_KEYS = ['country', 'permission', 'role', 'user', 'page', 'email-template'] as const;

export const ALL_SEEDERS = ENABLED_SEEDER_KEYS.map(key => SEEDERS_BY_KEY[key]);

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

export const SEEDER_METADATA_BY_KEY: Record<string, SeederMetadata> = Object.fromEntries(
    SEEDER_METADATA.map(m => [m.key, m]),
);

export const ENABLED_SEEDER_METADATA: SeederMetadata[] = ENABLED_SEEDER_KEYS.map(
    key => SEEDER_METADATA_BY_KEY[key],
).filter(Boolean);
