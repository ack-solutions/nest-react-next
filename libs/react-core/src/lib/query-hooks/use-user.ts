
import { IChangePasswordInput, IUser } from '@libs/types';
import { DefinedInitialDataOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invalidListQueryCache, invalidUpdateOrCreateQueryCache, UpdateQueryOptions, useCrudOperations } from '../hook';
import { UserService } from '../services';


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
            invalidListQueryCache(queryClient, service)
            invalidUpdateOrCreateQueryCache(queryClient, service, data?.id)
        },
        ...options,
    });

    const useChangePassword = (options?: UpdateQueryOptions<Partial<IChangePasswordInput>, Error, IChangePasswordInput>) => useMutation({
        mutationFn: (input: Partial<IChangePasswordInput>) => service.changePassword(input),
        onSuccess: (data) => {
            console.log(data);
        },
        ...options,
    });

    const useGetUserCountByStatus = (request?) => {
        return useQuery({
            queryKey: ['user-tab-count', request],
            queryFn: () => service.getCountByStatus(request),
        });
    };
    return {
        useGetMe,
        useUpdateProfile,
        useChangePassword,
        useGetUserCountByStatus,
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
