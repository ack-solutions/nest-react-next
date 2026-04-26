import { hasAnyAccess, ISessionUserData } from '@ackplus/nest-auth-client';
import { useAuth } from '@libs/react-shared';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
    NAVIGATION_ITEMS,
    NavigationGroup,
    NavigationItem,
    NavigationItemChildItem,
} from './navigation-config';

function hasAccess(
    item: {
        permissions?: string[];
        roles?: string[];
    },
    sessionData: ISessionUserData | null | undefined,
): boolean {
    return hasAnyAccess(sessionData, {
        permissions: item?.permissions || [],
        roles: item?.roles || [],
    });
}

function getVisibleChildren(
    item: NavigationItem,
    sessionData: ISessionUserData | null,
): NavigationItemChildItem[] | undefined {
    if (!item.children?.length) {
        return undefined;
    }

    const visibleChildren = item.children.filter((child) =>
        hasAccess(child, sessionData),
    );

    return visibleChildren.length ? visibleChildren : undefined;
}

function canViewItem(
    item: NavigationItem,
    sessionData: ISessionUserData | null | undefined,
): boolean {
    if (hasAccess(item, sessionData)) {
        return true;
    }

    return !!getVisibleChildren(item, sessionData)?.length;
}

function toVisibleItem(
    item: NavigationItem,
    sessionData: ISessionUserData | null | undefined,
): NavigationItem | null {
    if (!canViewItem(item, sessionData)) {
        return null;
    }

    return {
        ...item,
        children: getVisibleChildren(item, sessionData),
    };
}

function isPathActive(
    item: Pick<NavigationItem, 'path' | 'activePaths' | 'children'>,
    pathname: string,
): boolean {
    if (item.path && pathname === item.path) {
        return true;
    }

    if (item.activePaths?.some((path) => pathname.startsWith(path))) {
        return true;
    }

    return !!item.children?.some((child) => {
        if (child.path === pathname) {
            return true;
        }

        return !!child.activePaths?.some((path) => pathname.startsWith(path));
    });
}

export function useNavigation() {
    const { pathname } = useLocation();
    const { sessionData } = useAuth();

    const visibleItems = useMemo(() => {
        return NAVIGATION_ITEMS
            .map((item) => toVisibleItem(item, sessionData))
            .filter((item): item is NavigationItem => item !== null);
    }, [sessionData]);

    const navigation = useMemo(() => {
        const groups = new Map<string, NavigationItem[]>();

        for (const item of visibleItems) {
            const groupItems = groups.get(item.group) ?? [];
            groupItems.push(item);
            groups.set(item.group, groupItems);
        }

        return Array.from(groups.entries()).map(
            ([label, items]): NavigationGroup => ({
                label,
                items,
                permissions: [],
                roles: [],
            }),
        );
    }, [visibleItems]);

    const isItemActive = (item: NavigationItem) => isPathActive(item, pathname);

    return {
        navigation,
        visibleItems,
        isItemActive,
    };
}
