import { ComponentType } from 'react';
import {
    withRequirePermission as withRequirePermissionBase,
    createRequirePermissionHOC,
    WithRequirePermissionOptions
} from '@ackplus/nest-auth-react';

import { PermissionDeniedContent } from '../components/error/permission-denied-content';
/**
 * Creates a reusable HOC factory with PermissionDeniedContent as the default fallback
 *
 * @example
 * ```tsx
 * const withDealsPermission = createRequirePermission({
 *     permission: PermissionsEnum.ACCESS_DEALS,
 * });
 *
 * export default withDealsPermission(MyComponent);
 * ```
 */
export function createRequirePermission(
    defaultOptions: Partial<WithRequirePermissionOptions>
) {
    return createRequirePermissionHOC({
        FallbackComponent: PermissionDeniedContent,
        ...defaultOptions,
    });
}

/**
 * Higher-order component that wraps a component with permission checking
 * Uses PermissionDeniedContent as the default fallback when permission is denied
 *
 * @example
 * ```tsx
 * export default withRequirePermissionFallback(MyComponent, {
 *     permission: PermissionsEnum.ACCESS_DEALS,
 * });
 * ```
 */
export function withRequirePermissionFallback<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithRequirePermissionOptions
) {
    return withRequirePermissionBase(WrappedComponent, {
        FallbackComponent: PermissionDeniedContent,
        ...options,
    });
}
