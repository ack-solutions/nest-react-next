
import { useCrudOperations, UserService } from '@libs/react-core';
import { IUser } from '@libs/types';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

const service = UserService.getInstance<UserService>();

export const useUserQuery = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(service);

    const useGetMe = (options?: Partial<DefinedInitialDataOptions<any, Error, IUser>>) => useQuery({
        queryKey: [service.getQueryKey('me')],
        queryFn: () => service.getMe(),
        ...options,
    });

    return {
        useGetMe,
        useGetManyUser: useGetMany,
        useGetUserById: useGetOne,
        useCreateUser: useCreate,
        useDeleteUser: useDelete,
        useUpdateUser: useUpdate,
    };
};
