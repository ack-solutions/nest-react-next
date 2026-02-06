import { PermissionsEnum, RoleNameEnum } from '@libs/types';
import { ReactElement } from 'react';

import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import { PATH_DASHBOARD } from '../../../routes/paths';


export interface NavigationItem {
    id: string;
    title: string;
    path?: string;
    icon?: ReactElement;
    group: string;
    permissions?: PermissionsEnum[];
    roles?: RoleNameEnum[];
    activePaths?: string[];
    children?: NavigationItemChildItem[];
}

export type NavigationItemChildItem = Omit<NavigationItem, 'icon' | 'group'> & {
    path: string;
};

export interface NavigationGroup {
    label: string;
    items: NavigationItem[];
    permissions: PermissionsEnum[];
    roles: RoleNameEnum[];
}

// Navigation items configuration
export const NAVIGATION_ITEMS: NavigationItem[] = [
    // Overview
    {
        id: 'dashboard',
        title: 'Dashboard',
        path: PATH_DASHBOARD.root,
        icon: <Icon icon={IconEnum.House} />,
        group: 'Overview',
        activePaths: [PATH_DASHBOARD.root],
    },
    // {
    //     id: 'reports',
    //     title: 'Reports',
    //     path: PATH_DASHBOARD.reports.root,
    //     icon: <Icon icon={IconEnum.FileText} />,
    //     group: 'Overview',
    //     permissions: [PermissionsEnum.ACCESS_REPORTS],
    //     activePaths: [PATH_DASHBOARD.reports.root],
    // },

    // User Management
    {
        id: 'users',
        title: 'Users',
        path: PATH_DASHBOARD.users.root,
        icon: <Icon icon={IconEnum.User} />,
        group: 'Users',
        permissions: [PermissionsEnum.ACCESS_USERS],
        activePaths: [PATH_DASHBOARD.users.root],
    },
    {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        icon: <Icon icon={IconEnum.Shield} />,
        group: 'Users',
        permissions: [PermissionsEnum.ACCESS_ROLES],
        children: [
            {
                id: 'roles',
                title: 'Roles',
                path: PATH_DASHBOARD.users.roles.root,
            },
            {
                id: 'permissions',
                title: 'Permissions',
                path: PATH_DASHBOARD.users.permissions,
            },
        ],
    },
    // {
    //     id: 'test',
    //     title: 'Test',
    //     path: PATH_DASHBOARD.test.root,
    //     icon: <Icon icon={IconEnum.File} />,
    //     group: 'Test',
    //     activePaths: [PATH_DASHBOARD.test.root],
    // },

    // Content Management
    {
        id: 'pages',
        title: 'Pages',
        path: PATH_DASHBOARD.pages.root,
        icon: <Icon icon={IconEnum.File} />,
        group: 'Content',
        permissions: [PermissionsEnum.ACCESS_PAGES],
        activePaths: [PATH_DASHBOARD.pages.root],
    },
    {
        id: 'templates',
        title: 'Templates',
        path: PATH_DASHBOARD.templates.root,
        icon: <Icon icon={IconEnum.LayoutTemplate} />,
        group: 'Content',
        permissions: [PermissionsEnum.ACCESS_TEMPLATES],
        activePaths: [PATH_DASHBOARD.templates.root],
    },
    {
        id: 'template-layouts',
        title: 'Template Layouts',
        path: PATH_DASHBOARD.templateLayouts.root,
        icon: <Icon icon={IconEnum.LayoutGrid} />,
        group: 'Content',
        permissions: [PermissionsEnum.ACCESS_TEMPLATE_LAYOUTS],
        activePaths: [PATH_DASHBOARD.templateLayouts.root],
    },
    // System
    {
        id: 'settings',
        title: 'Settings',
        icon: <Icon icon={IconEnum.Settings} />,
        group: 'System',
        permissions: [PermissionsEnum.ACCESS_SETTINGS],
        children: [
            {
                id: 'general-settings',
                title: 'General Settings',
                path: PATH_DASHBOARD.settings.root,
            },
        ],
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
