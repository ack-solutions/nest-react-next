import {
    ICreatePermissionInput,
    IPermission,
    IUpdatePermissionInput,
} from '@libs/types';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { PermissionService } from '../services/permission.service';

const QUERY_KEY = 'permissions';

const permissionService = PermissionService.getInstance<PermissionService>();

export function usePermission() {
    const queryClient = useQueryClient();

    // Get all permissions
    const useGetPermissions = (
        params?: {
            search?: string;
            category?: string;
            guard?: string;
            limit?: number;
        },
        options?: Partial<
            UseQueryOptions<{ items: IPermission[]; total: number }>
        >,
    ) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'list', params],
            queryFn: () => permissionService.getPermissions(params),
            ...options,
        });
    };

    // Get permission by id
    const useGetPermissionById = (
        id: string,
        options?: Partial<UseQueryOptions<IPermission>>,
    ) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'byId', id],
            queryFn: () => permissionService.getPermissionById(id),
            enabled: !!id,
            ...options,
        });
    };

    // Get permissions by guard
    const useGetPermissionsByGuard = (
        guard: string,
        options?: Partial<UseQueryOptions<IPermission[]>>,
    ) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'byGuard', guard],
            queryFn: () => permissionService.getPermissionsByGuard(guard),
            enabled: !!guard,
            ...options,
        });
    };

    // Get all categories
    const useGetCategories = (options?: Partial<UseQueryOptions<string[]>>) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'categories'],
            queryFn: () => permissionService.getCategories(),
            ...options,
        });
    };

    // Get all guards
    const useGetGuards = (options?: Partial<UseQueryOptions<string[]>>) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'guards'],
            queryFn: () => permissionService.getGuards(),
            ...options,
        });
    };

    // Search permissions
    const useSearchPermissions = (
        query: string,
        guard?: string,
        limit?: number,
        options?: Partial<UseQueryOptions<IPermission[]>>,
    ) => {
        return useQuery({
            queryKey: [QUERY_KEY, 'search', query, guard, limit],
            queryFn: () =>
                permissionService.searchPermissions(query, guard, limit),
            enabled: !!query,
            ...options,
        });
    };

    // Create permission
    const useCreatePermission = () => {
        return useMutation({
            mutationFn: (data: ICreatePermissionInput) =>
                permissionService.createPermission(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    };

    // Create multiple permissions
    const useCreatePermissions = () => {
        return useMutation({
            mutationFn: (permissions: ICreatePermissionInput[]) =>
                permissionService.createPermissions(permissions),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    };

    // Update permission
    const useUpdatePermission = () => {
        return useMutation({
            mutationFn: ({
                id,
                ...data
            }: { id: string } & IUpdatePermissionInput) =>
                permissionService.updatePermission(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    };

    // Delete permission
    const useDeletePermission = () => {
        return useMutation({
            mutationFn: (id: string) => permissionService.deletePermission(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            },
        });
    };

    return useMemo(
        () => ({
            useGetPermissions,
            useGetPermissionById,
            useGetPermissionsByGuard,
            useGetCategories,
            useGetGuards,
            useSearchPermissions,
            useCreatePermission,
            useCreatePermissions,
            useUpdatePermission,
            useDeletePermission,
        }),
        [],
    );
}
