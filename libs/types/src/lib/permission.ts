export enum PermissionGuardEnum {
    ADMIN = 'Admin',
    PORTAL = 'Portal',
    CUSTOMER_PORTAL = 'Customer Portal',
}

export enum PermissionsEnum {
    ACCESS_USERS = 'access-users',
    CREATE_USERS = 'create-users',
    UPDATE_USERS = 'update-users',
    DELETE_USERS = 'delete-users',

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

}
