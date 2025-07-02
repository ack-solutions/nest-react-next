import { RoleNameEnum } from '@libs/types';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { NAVIGATION_ITEMS, NavigationGroup, NavigationItem } from './navigation-config';
import { useAccess } from '../../../contexts';


export function useNavigation() {
    const { hasAnyPermission, hasAnyRole, hasRole } = useAccess();
    const { pathname } = useLocation();

    // Filter items based on permissions and roles
    const visibleItems = useMemo(() => {
        return NAVIGATION_ITEMS.filter((item) => {
            // Super Admin has access to everything
            const isSuperAdmin = hasRole([RoleNameEnum.SUPER_ADMIN]);
            if (isSuperAdmin) {
                return true;
            }

            // If no permissions or roles are specified, item is visible
            if (!item.permissions?.length && !item.roles?.length) {
                return true;
            }

            // Check permissions and roles
            const hasPermission = item.permissions?.length
                ? hasAnyPermission(item.permissions)
                : true;
            const hasRequiredRole = item.roles?.length
                ? hasAnyRole(item.roles)
                : true;

            return hasPermission || hasRequiredRole;
        });
    }, [
        hasAnyPermission,
        hasAnyRole,
        hasRole,
    ]);

    // Group items by their group property
    const groupedNavigation = useMemo(() => {
        const groups: Record<string, NavigationItem[]> = {};

        visibleItems.forEach((item) => {
            if (!groups[item.group]) {
                groups[item.group] = [];
            }
            groups[item.group].push(item);
        });

        return Object.entries(groups).map(([label, items]): NavigationGroup => ({
            label,
            items,
        }));
    }, [visibleItems]);

    // Check if a navigation item is active
    const isItemActive = useMemo(() => {
        return (item: NavigationItem): boolean => {
            if (item.activePaths?.length) {
                return item.activePaths.some(path => pathname.includes(path));
            }
            return pathname.includes(item.path);
        };
    }, [pathname]);

    return {
        navigation: groupedNavigation,
        isItemActive,
        visibleItems,
    };
}
