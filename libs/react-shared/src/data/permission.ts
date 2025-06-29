import { PermissionsEnum } from '@libs/types';


export const depedancyPermissions = {
    [PermissionsEnum.CREATE_USERS]: [PermissionsEnum.ACCESS_USERS],
    [PermissionsEnum.DELETE_USERS]: [PermissionsEnum.ACCESS_USERS],
    [PermissionsEnum.UPDATE_USERS]: [PermissionsEnum.ACCESS_USERS],

    [PermissionsEnum.EXPORT_REPORTS]: [PermissionsEnum.ACCESS_REPORTS],

    [PermissionsEnum.CREATE_ROLES]: [PermissionsEnum.ACCESS_ROLES],
    [PermissionsEnum.DELETE_ROLES]: [PermissionsEnum.ACCESS_ROLES],
    [PermissionsEnum.UPDATE_ROLES]: [PermissionsEnum.ACCESS_ROLES],

    [PermissionsEnum.CREATE_PAGES]: [PermissionsEnum.ACCESS_PAGES],
    [PermissionsEnum.DELETE_PAGES]: [PermissionsEnum.ACCESS_PAGES],
    [PermissionsEnum.UPDATE_PAGES]: [PermissionsEnum.ACCESS_PAGES],

    [PermissionsEnum.CREATE_EMAIL_TEMPLATES]: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],
    [PermissionsEnum.DELETE_EMAIL_TEMPLATES]: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],
    [PermissionsEnum.UPDATE_EMAIL_TEMPLATES]: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],

    [PermissionsEnum.UPDATE_SETTINGS]: [PermissionsEnum.ACCESS_SETTINGS],
};
