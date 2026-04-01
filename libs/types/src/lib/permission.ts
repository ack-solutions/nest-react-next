export interface IPermission {
    id: string;
    name: string;
    guard?: string;
    description?: string;
    category?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreatePermissionInput {
    name: string;
    guard?: string;
    description?: string;
    category?: string;
    metadata?: Record<string, any>;
}

export interface IUpdatePermissionInput {
    name?: string;
    guard?: string;
    description?: string;
    category?: string;
    metadata?: Record<string, any>;
}

export enum PermissionsEnum {
    ACCESS_USERS = 'access-users',
    CREATE_USERS = 'create-users',
    UPDATE_USERS = 'update-users',
    DELETE_USERS = 'delete-users',
    RESET_PASSWORD_USERS = 'reset-password-users',

    ACCESS_REPORTS = 'access-reports',
    EXPORT_REPORTS = 'export-reports',

    ACCESS_ROLES = 'access-roles',
    CREATE_ROLES = 'create-roles',
    UPDATE_ROLES = 'update-roles',
    ASSIGN_ROLES = 'assign-roles',
    DELETE_ROLES = 'delete-roles',


    ACCESS_PAGES = 'access-pages',
    CREATE_PAGES = 'create-pages',
    UPDATE_PAGES = 'update-pages',
    DELETE_PAGES = 'delete-pages',

    ACCESS_EMAIL_TEMPLATES = 'access-email-templates',
    CREATE_EMAIL_TEMPLATES = 'create-email-templates',
    UPDATE_EMAIL_TEMPLATES = 'update-email-templates',
    DELETE_EMAIL_TEMPLATES = 'delete-email-templates',

    ACCESS_SETTINGS = 'access-settings',
    UPDATE_SETTINGS = 'update-settings',

    ACCESS_TEMPLATES = 'access-templates',
    CREATE_TEMPLATES = 'create-templates',
    UPDATE_TEMPLATES = 'update-templates',
    DELETE_TEMPLATES = 'delete-templates',

    ACCESS_TEMPLATE_LAYOUTS = 'access-template-layouts',
    CREATE_TEMPLATE_LAYOUTS = 'create-template-layouts',
    UPDATE_TEMPLATE_LAYOUTS = 'update-template-layouts',
    DELETE_TEMPLATE_LAYOUTS = 'delete-template-layouts',


}
