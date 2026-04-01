import { IChangeEmailInput, IChangePasswordInput, IChangePhoneNumberInput, IDeleteAccountInput, ISetPasswordInput, IUser } from '@libs/types';
import {
    DefinedInitialDataOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { UserService } from '../services';
import {
    invalidListQueryCache,
    invalidUpdateOrCreateQueryCache,
    UpdateQueryOptions,
    useCrudOperations,
} from './use-crud-operations';


const userService = UserService.getInstance<UserService>();

export const useUser = () => {
    const {
        useGetMany,
        fetchMany,
        useGetCounts,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useBulkRestore,
    } = useCrudOperations(userService);
    const queryClient = useQueryClient();


    const useGetMe = (
        options?: Partial<DefinedInitialDataOptions<any, Error, IUser>>,
    ) => useQuery({
        queryKey: [],
        queryFn: () => userService.getMe(),
        ...options,
    });

    const useUpdateProfile = (
        options?: UpdateQueryOptions<Partial<IUser>, Error, IUser>,
    ) => useMutation({
        mutationFn: (input: Partial<IUser>) => userService.updateProfile(input),
        onSuccess: (data) => {
            invalidListQueryCache(queryClient, userService);
            invalidUpdateOrCreateQueryCache(
                queryClient,
                userService,
                data?.id,
            );
        },
        ...options,
    });

    /**
     * Change password for own account
     */
    const useChangePassword = (
        options?: UpdateQueryOptions<
            Partial<IChangePasswordInput>,
            Error,
            IChangePasswordInput
        >,
    ) => useMutation({
        mutationFn: (input: Partial<IChangePasswordInput>) => userService.changePassword(input),
        ...options,
    });

    /**
     * Set password for user
     */
    const useSetPassword = (options?: UpdateQueryOptions<Partial<ISetPasswordInput>, Error, any>) => useMutation({
        mutationFn: (input: ISetPasswordInput & { userId: string }) => userService.setPassword(input?.userId, input),
        ...options,
    });

    const useChangeEmail = (
        options?: UpdateQueryOptions<Partial<IChangeEmailInput>, Error, IChangeEmailInput
        >,
    ) => useMutation({
        mutationFn: (input: IChangeEmailInput) => userService.changeEmail(input),
        ...options,
    });

    const useChangePhone = (
        options?: UpdateQueryOptions<Partial<IChangePhoneNumberInput>, Error, IChangePhoneNumberInput
        >,
    ) => useMutation({
        mutationFn: (input: IChangePhoneNumberInput) => userService.changePhone(input),
        ...options,
    });

    const useDeleteAccount = (options?: any) => useMutation<any, Error, any>({
        mutationFn: (request: IDeleteAccountInput) => userService.deleteAccount(request),
        ...options,
    });

    return {
        useGetMe,
        useUpdateProfile,
        useDeleteAccount,
        useChangePassword,
        useSetPassword,
        useChangeEmail,
        useChangePhone,
        useGetManyUser: useGetMany,
        useFetchManyUser: fetchMany,
        useGetUserById: useGetOne,
        useGetUserCounts: useGetCounts,
        useCreateUser: useCreate,
        useDeleteUser: useDelete,
        useUpdateUser: useUpdate,
        useRestoreUser: useRestore,
        useDeleteForeverUser: useDeleteForever,
        useBulkDeleteUser: useBulkDelete,
        useBulkDeleteForeverUser: useBulkDeleteForever,
        useBulkRestoreUser: useBulkRestore,
    };
};
