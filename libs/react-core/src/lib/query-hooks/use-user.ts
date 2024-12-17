
import { UpdateQueryOptions, useCrudOperations, UserService } from '@libs/react-core';
import { IChangePasswordInput, IUser } from '@libs/types';
import { DefinedInitialDataOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const service = UserService.getInstance<UserService>();

export const useUserQuery = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useRestore,
        useBulkRestore
    } = useCrudOperations(service);
    const queryClient = useQueryClient();

    const useGetMe = (options?: Partial<DefinedInitialDataOptions<any, Error, IUser>>) => useQuery({
        queryKey: [service.getQueryKey('me')],
        queryFn: () => service.getMe(),
        ...options,
    });

    const useUpdateProfile = (options?: UpdateQueryOptions<Partial<IUser>, Error, IUser>) => useMutation({
        mutationFn: (input: Partial<IUser>) => service.updateProfile(input),
        onSuccess: (data) => {
            if (!options?.disableCacheUpdate) {
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === data.id
                });
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
                });
            }
        },
        ...options,
    });

    const useChangePassword = (options?: UpdateQueryOptions<Partial<IChangePasswordInput>, Error, IChangePasswordInput>) => useMutation({
        mutationFn: (input: Partial<IChangePasswordInput>) => service.changePassword(input),
        onSuccess: (data) => {
            if (!options?.disableCacheUpdate) {
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === data.id
                });
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
                });
            }
        },
        ...options,
    });

    return {
        useGetMe,
        useUpdateProfile,
        useChangePassword,
        useGetManyUser: useGetMany,
        useGetUserById: useGetOne,
        useCreateUser: useCreate,
        useDeleteUser: useDelete,
        useUpdateUser: useUpdate,
        useDeleteForeverUser: useDeleteForever,
        useBulkDeleteUser: useBulkDelete,
        useBulkDeleteForeverUser: useBulkDeleteForever,
        useRestoreUser: useRestore,
        useBulkRestoreUser: useBulkRestore
    };
};
