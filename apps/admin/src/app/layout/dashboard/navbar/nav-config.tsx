import { PermissionsEnum, RoleNameEnum } from '@libs/types';
import { useMemo } from 'react';

import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import { PATH_DASHBOARD } from '../../../routes/paths';


const ICONS = {
    dashboard: <Icon icon={IconEnum.HOUSE_LINE} />,
    reports: <Icon icon={IconEnum.REPORT} />,
    user: <Icon icon={IconEnum.USER} />,
    setting: <Icon icon={IconEnum.GEAR_SIX} />,
    roles: <Icon icon={IconEnum.SHIELD} />,
    permissions: <Icon icon={IconEnum.LOCK} />,
    pages: <Icon icon={IconEnum.FILE} />,
    emailTemplates: <Icon icon={IconEnum.EMAIL} />,
};

export function useNavData() {
    //    const pluginNavigationItems = getPluginNavigationItems();

    const navigationItems = useMemo(
        () => [
            {
                id: 'dashboard',
                groupName: 'OVERVIEW',
                title: 'Dashboard',
                path: PATH_DASHBOARD.root,
                icon: ICONS.dashboard,
                activePaths: [PATH_DASHBOARD.root],
            },
            {
                id: 'reports',
                groupName: 'OVERVIEW',
                title: 'Reports',
                path: PATH_DASHBOARD.reports.root,
                icon: ICONS.reports,
                permissions: [PermissionsEnum.ACCESS_REPORTS],
                activePaths: [PATH_DASHBOARD.reports.root],
            },
            {
                id: 'users',
                title: 'Users',
                groupName: 'Users',
                path: PATH_DASHBOARD.users.root,
                icon: ICONS.user,
                roles: [RoleNameEnum.ADMIN],
                permissions: [PermissionsEnum.ACCESS_USERS],
                activePaths: [PATH_DASHBOARD.users.root],
            },
            {
                id: 'roles',
                title: 'Roles',
                groupName: 'Users',
                path: PATH_DASHBOARD.users.roles.root,
                icon: ICONS.roles,
                activePaths: [PATH_DASHBOARD.users.roles.root],
                roles: [RoleNameEnum.ADMIN],
                permissions: [PermissionsEnum.ACCESS_ROLES],
            },
            {
                id: 'pages',
                title: 'Pages',
                groupName: 'Content',
                path: PATH_DASHBOARD.pages.root,
                icon: ICONS.pages,
                activePaths: [PATH_DASHBOARD.pages.root],
                roles: [RoleNameEnum.ADMIN],
                permissions: [PermissionsEnum.ACCESS_PAGES],
            },
            {
                id: 'email-templates',
                title: 'Email Templates',
                groupName: 'Content',
                path: PATH_DASHBOARD.emailTemplates.root,
                icon: ICONS.emailTemplates,
                activePaths: [PATH_DASHBOARD.emailTemplates.root],
                roles: [RoleNameEnum.ADMIN],
                permissions: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],
            },
            {
                id: 'settings',
                title: 'Settings',
                groupName: 'System',
                path: PATH_DASHBOARD.settings.root,
                icon: ICONS.setting,
                activePaths: [PATH_DASHBOARD.settings.root],
                roles: [RoleNameEnum.ADMIN],
                permissions: [PermissionsEnum.ACCESS_SETTINGS],
            },
        ],
        [],
    );

    const groupedItems = [...navigationItems].reduce(
        (acc, item) => {
            const group = item.groupName || 'Other'; // Default to 'Other' if no groupName
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(item);
            return acc;
        },
        {} as Record<string, any[]>,
    );

    const navConfig = Object.keys(groupedItems).map((groupName) => {
        const items = groupedItems[groupName];
        const tree = buildTree(items);

        return {
            subheader: groupName,
            items: tree,
        };
    });
    return navConfig;
}

export function buildTree(items: any[]): any[] {
    const itemMap = new Map<string, any>();
    const roots: any[] = [];

    // First, create a map of all items
    items.forEach((item) => {
        itemMap.set(item.id || '', {
            icon: item.icon,
            permissions: item.permissions,
            order: item.order,
            children: item.children,
            ...item,
        });
    });

    // Then, build the tree
    items.forEach((item) => {
        const id = item.id || '';
        const parentId = item.parentId || '';
        const navItem = itemMap.get(id);

        if (parentId && itemMap.has(parentId)) {
            const parentItem = itemMap.get(parentId) || {} as any;
            parentItem.children = parentItem.children || [];
            parentItem.children.push(navItem);
        } else {
            roots.push(navItem);
        }
    });

    return roots;
}
