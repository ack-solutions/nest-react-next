import { IPaginationResult, IRole, IRoleGetInput, ISuccessResponse } from '@libs/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DefinedInitialDataOptions } from '@tanstack/react-query';

import { RoleService, UserService } from '../services';
import { CreateQueryOptions, invalidUpdateOrCreateQueryCache, UpdateQueryOptions, useCrudOperations } from './use-crud-operations';


const roleService = RoleService.getInstance<RoleService>();
const userService = UserService.getInstance<UserService>();

export const useRole = () => {
    const queryClient = useQueryClient();
    // const {
    //     useCreate,
    //     useUpdate,
    //     useDelete,
    // } = useCrudOperations(roleService);

    const useGetRoles = (request?: IRoleGetInput, options?: Partial<DefinedInitialDataOptions<IRole[]>>) => useQuery({
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

    const useCreateRole = (options?: CreateQueryOptions<IRole, Error, Partial<IRole>>) => useMutation({
        mutationFn: (input: Partial<IRole>) => roleService.create(input),
        onSuccess: (data, variables, _context) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === roleService.getQueryKey('get-all') ||
                        query.queryKey[0] === roleService.getQueryKey('get-role-by-guard');
                },
            });
        },
        ...options,
    });
    const useUpdateRole = (options?: UpdateQueryOptions<IRole, Error, Partial<IRole>>) => useMutation({
        mutationFn: (input: Partial<IRole>) => roleService.update(input?.id as any, input),
        onSuccess: (data, variables, _context) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === roleService.getQueryKey('get-all') ||
                        query.queryKey[0] === roleService.getQueryKey('get-role-by-guard') ||
                        (query.queryKey[0] === roleService.getQueryKey('get-role-by-id') && query.queryKey[1] === data?.id);
                },
            });
        },
        ...options,
    });
    const useDeleteRole = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) => useMutation({
        mutationFn: (id: string) => roleService.delete(id),
        onSuccess: (_data, variable) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === roleService.getQueryKey('get-all') ||
                        query.queryKey[0] === roleService.getQueryKey('get-role-by-guard') ||
                        (query.queryKey[0] === roleService.getQueryKey('get-role-by-id') && query.queryKey[1] === variable);
                },
            });
        },
        ...options,
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
