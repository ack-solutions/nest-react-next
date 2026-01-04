import { IPaginationResult, IRole, IRoleGetInput, ISuccessResponse } from '@libs/types';
import { useQuery } from '@tanstack/react-query';
import { DefinedInitialDataOptions } from '@tanstack/react-query';

import { RoleService, UserService } from '../services';
import { UpdateQueryOptions, useCrudOperations } from './use-crud-operations';


const roleService = RoleService.getInstance<RoleService>();
const userService = UserService.getInstance<UserService>();

export const useRole = () => {
    const {
        useCreate,
        useUpdate,
        useDelete,
    } = useCrudOperations(roleService);


    const useGetRoles = (request: IRoleGetInput, options?: Partial<DefinedInitialDataOptions<IPaginationResult<IRole>>>) => useQuery({
        queryKey: [roleService.getQueryKey('get-all'), request],
        queryFn: () => roleService.getRoles(request),
        ...options,
    });

    const useGetRoleByGuard = (guard: string, request?: IRoleGetInput, options?: Partial<DefinedInitialDataOptions<IRole[]>>) => useQuery({
        queryKey: [
            roleService.getQueryKey('get-role-by-guard'),
            guard,
            request,
        ],
        queryFn: () => roleService.getRoleByGuard(guard, request),
        ...options,
    });

    const useGetRoleById = (id: string, options?: Partial<DefinedInitialDataOptions<IRole>>) => useQuery({
        queryKey: [roleService.getQueryKey('get-role-by-id'), id],
        queryFn: () => roleService.getRoleById(id),
        ...options,
    });

    const useCreateRole = (options?: UpdateQueryOptions<IRole, Error, Partial<IRole>>) => useCreate({
        ...options,
        invalidateQueryKeys: [roleService.getQueryKey('get-role-by-guard')],
    });

    const useUpdateRole = (options?: UpdateQueryOptions<IRole, Error, Partial<IRole>>) => useUpdate({
        ...options,
        invalidateQueryKeys: (variables) => [
            roleService.getQueryKey('get-role-by-guard'),
            [roleService.getQueryKey('get-role-by-id'), variables?.id],
            userService.getQueryKey('get-many'),
            [userService.getQueryKey('get')],
        ],

    });

    const useDeleteRole = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) => useDelete({
        ...options,
        invalidateQueryKeys: (variables) => [
            roleService.getQueryKey('get-role-by-guard'),
            [roleService.getQueryKey('get-role-by-id'), variables],
            userService.getQueryKey('get-many'),
            [userService.getQueryKey('get')],
        ],
    });

    return {
        useGetRoleByGuard,
        useGetRoles,
        useGetRoleById,
        useCreateRole,
        useDeleteRole,
        useUpdateRole,
    };
};
