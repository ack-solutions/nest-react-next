import { RoleNameEnum } from '@libs/types';
import React, { ComponentType } from 'react';


import useAccess from './use-access';
import PermissionDeniedContent from '../../components/error/permission-denied-content';
import PermissionDenied from '../../pages/error/permission-denied';


export interface WithPermissionOptions {
    permissions?: string[] | string;
    roles?: string[] | string;
    requireAll?: boolean;
    fallback?: ComponentType<{ message?: string }>;
    message?: string;
    preserveLayout?: boolean; // New option to preserve layout
}

const withPermission = <T extends object>(
    options: WithPermissionOptions,
) => {
    return (wrappedComponent: ComponentType<T>): ComponentType<T> => {
        function PermissionWrappedComponent(props: T) {
            const { hasPermission, hasAnyPermission, hasRole, hasAnyRole, isLoaded } = useAccess();
            const {
                permissions,
                roles,
                requireAll = false,
                fallback: FallbackComponent,
                message,
                preserveLayout = true, // Default to preserving layout
            } = options;

            const roleArray = Array.isArray(roles) ? roles : [roles];
            const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

            if (!isLoaded) {
                return null;
            }

            // Check if user is Super Admin - if so, grant access automatically
            const isSuperAdmin = hasRole([RoleNameEnum.SUPER_ADMIN]);
            if (isSuperAdmin) {
                return React.createElement(wrappedComponent, props);
            }

            const hasAccess = requireAll
                ? hasPermission(permissionArray) || hasRole(roleArray)
                : hasAnyPermission(permissionArray) || hasAnyRole(roleArray);

            if (!hasAccess) {
                // Use custom fallback component if provided
                if (FallbackComponent) {
                    return React.createElement(FallbackComponent, { message });
                }

                // Choose between layout-preserving and full-screen error based on preserveLayout option
                const ErrorComponent = preserveLayout ? PermissionDeniedContent : PermissionDenied;
                return React.createElement(ErrorComponent, { message });
            }

            return React.createElement(wrappedComponent, props);
        }

        PermissionWrappedComponent.displayName = `withPermission(${wrappedComponent.displayName || wrappedComponent.name})`;

        return PermissionWrappedComponent;
    };
};

export default withPermission;
