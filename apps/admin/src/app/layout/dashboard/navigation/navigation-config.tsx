import { PermissionsEnum, RoleNameEnum } from '@libs/types';
import { ReactElement } from 'react';

import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import { PATH_DASHBOARD } from '../../../routes/paths';


export interface NavigationItem {
    id: string;
    title: string;
    path: string;
    icon: ReactElement;
    group: string;
    permissions?: PermissionsEnum[];
    roles?: RoleNameEnum[];
    activePaths?: string[];
    children?: NavigationItem[];
}

export interface NavigationGroup {
    label: string;
    items: NavigationItem[];
}

// Navigation items configuration
export const NAVIGATION_ITEMS: NavigationItem[] = [
    // Overview
    {
        id: 'dashboard',
        title: 'Dashboard',
        path: PATH_DASHBOARD.root,
        icon: <Icon icon={IconEnum.HOUSE_LINE} />,
        group: 'Overview',
        activePaths: [PATH_DASHBOARD.root],
    },
    {
        id: 'reports',
        title: 'Reports',
        path: PATH_DASHBOARD.reports.root,
        icon: <Icon icon={IconEnum.REPORT} />,
        group: 'Overview',
        permissions: [PermissionsEnum.ACCESS_REPORTS],
        activePaths: [PATH_DASHBOARD.reports.root],
    },

    // User Management
    {
        id: 'users',
        title: 'Users',
        path: PATH_DASHBOARD.users.root,
        icon: <Icon icon={IconEnum.USER} />,
        group: 'Users',
        permissions: [PermissionsEnum.ACCESS_USERS],
        activePaths: [PATH_DASHBOARD.users.root],
    },
    {
        id: 'roles',
        title: 'Roles',
        path: PATH_DASHBOARD.users.roles.root,
        icon: <Icon icon={IconEnum.SHIELD} />,
        group: 'Users',
        permissions: [PermissionsEnum.ACCESS_ROLES],
        activePaths: [PATH_DASHBOARD.users.roles.root],
    },

    // Content Management
    {
        id: 'pages',
        title: 'Pages',
        path: PATH_DASHBOARD.pages.root,
        icon: <Icon icon={IconEnum.FILE} />,
        group: 'Content',
        permissions: [PermissionsEnum.ACCESS_PAGES],
        activePaths: [PATH_DASHBOARD.pages.root],
    },
    {
        id: 'email-templates',
        title: 'Email Templates',
        path: PATH_DASHBOARD.emailTemplates.root,
        icon: <Icon icon={IconEnum.EMAIL} />,
        group: 'Content',
        permissions: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],
        activePaths: [PATH_DASHBOARD.emailTemplates.root],
    },

    // System
    {
        id: 'settings',
        title: 'Settings',
        path: PATH_DASHBOARD.settings.root,
        icon: <Icon icon={IconEnum.GEAR_SIX} />,
        group: 'System',
        permissions: [PermissionsEnum.ACCESS_SETTINGS],
        activePaths: [PATH_DASHBOARD.settings.root],
    },
];

// Navigation configuration constants
export const NAV_CONFIG = {
    VERTICAL: {
        itemGap: 4,
        iconSize: 18,
        itemRootHeight: 44,
        itemSubHeight: 36,
        itemPadding: '4px 8px 4px 12px',
        itemRadius: 8,
    },
    MINI: {
        itemGap: 8,
        iconSize: 16,
        itemRootHeight: 56,
        itemSubHeight: 34,
        itemPadding: '6px 0 0 0',
        itemRadius: 6,
    },
} as const;
