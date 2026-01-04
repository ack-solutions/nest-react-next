import { PermissionsEnum, RoleNameEnum } from '@libs/types';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { NAVIGATION_ITEMS, NavigationGroup, NavigationItem } from './navigation-config';
import { hasPermission } from '@ackplus/nest-auth-client';
import { useHasPermission, useHasRole } from '@ackplus/nest-auth-react';


export function useNavigation() {
    const { pathname } = useLocation();

    // Filter items based on permissions and roles
    const visibleItems = useMemo(() => {
        return NAVIGATION_ITEMS
        // .filter((item) => {
        //     // Super Admin has access to everything
        //     const isSuperAdmin = useHasRole([RoleNameEnum.SUPER_ADMIN]);
        //     if (isSuperAdmin) {
        //         return true;
        //     }

        //     // If no permissions or roles are specified, item is visible
        //     if (!item.permissions?.length && !item.roles?.length) {
        //         return true;
        //     }

        //     // Check permissions and roles
        //     const hasPermission = item.permissions?.length
        //         ? useHasPermission(item.permissions)
        //         : true;
        //     const hasRequiredRole = item.roles?.length
        //         ? useHasRole(item.roles)
        //         : true;

        //     return hasPermission || hasRequiredRole;
        // });
    }, []);

    // Group items by their group property
    const groupedNavigation = useMemo(() => {
        const groups: Record<string, { permissions: PermissionsEnum[], roles: RoleNameEnum[], items: NavigationItem[] }> = {};

        visibleItems.forEach((item) => {
            if (!groups[item.group]) {
                groups[item.group] = { permissions: [], items: [], roles: [] };
            }
            groups[item.group].items.push(item);
            // Aggregate permissions and roles from all items in the group
            if (Array.isArray(item.permissions)) {
                groups[item.group].permissions = [
                    ...new Set([...groups[item.group].permissions, ...item.permissions])
                ];
            }
            if (Array.isArray(item.roles)) {
                groups[item.group].roles = [
                    ...new Set([...groups[item.group].roles, ...item.roles])
                ];
            }
        });

        return Object.entries(groups).map(([label, data]): NavigationGroup => ({
            label,
            items: data.items,
            permissions: data.permissions,
            roles: data.roles,
        }));
    }, [visibleItems]);

    // Check if a navigation item is active
    const isItemActive = useMemo(() => {
        return (item: NavigationItem): boolean => {
            // Check exact path match
            if (item.path && pathname === item.path) {
                return true;
            }

            // Check active paths
            if (item.activePaths?.length) {
                return item.activePaths.some(path => pathname.startsWith(path));
            }

            // Check if any child items are active (for parent highlighting)
            if (item.children?.length) {
                return item.children.some(child => {
                    if (child.path && pathname === child.path) {
                        return true;
                    }
                    if (child.activePaths?.length) {
                        return child.activePaths.some(path => pathname.startsWith(path));
                    }
                    return false;
                });
            }

            return false;
        };
    }, [pathname]);

    return {
        navigation: groupedNavigation,
        isItemActive,
        visibleItems,
    };
}
