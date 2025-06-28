import { PermissionsEnum, RoleGuardEnum } from '@libs/types';
import React, { ComponentType } from 'react';

import useAccess from './use-access';
import PermissionDenied from '../../pages/error/permission-denied';


export interface WithPermissionOptions {
    permissions?: PermissionsEnum[] | PermissionsEnum;
    roles?: RoleGuardEnum[] | RoleGuardEnum;
    requireAll?: boolean;
    fallback?: React.ComponentType<any>;
    message?: string;
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
                fallback: FallbackComponent = PermissionDenied,
                message,
            } = options;

            const roleArray = Array.isArray(roles) ? roles : [roles];

            const permissionArray = Array.isArray(permissions) ? permissions : [permissions];

            if (!isLoaded) {
                return null;
            }

            const hasAccess = requireAll
                ? hasPermission(permissionArray) || hasRole(roleArray)
                : hasAnyPermission(permissionArray) || hasAnyRole(roleArray);

            if (!hasAccess) {
                return React.createElement(FallbackComponent, { message });
            }

            return React.createElement(wrappedComponent, props);
        }

        PermissionWrappedComponent.displayName = `withPermission(${wrappedComponent.displayName || wrappedComponent.name})`;

        return PermissionWrappedComponent;
    };
};

export default withPermission;
