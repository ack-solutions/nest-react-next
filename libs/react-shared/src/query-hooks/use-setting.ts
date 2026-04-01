import { ISetting } from '@libs/types';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { SettingService } from '../services';
import { useCrudOperations } from './use-crud-operations';


const settingService = SettingService.getInstance<SettingService>();

export const useSetting = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useBulkRestore,
    } = useCrudOperations(settingService);

    const useUpdateSettings = (options?: UseMutationOptions<ISetting, Error, any>) => useMutation({
        ...options,
        mutationFn: (input: any) => settingService.updateSettings(input),
    });


    return {
        useUpdateSettings,
        useGetManySetting: useGetMany,
        useGetSettingById: useGetOne,
        useCreateSetting: useCreate,
        useDeleteSetting: useDelete,
        useUpdateSetting: useUpdate,
        useRestoreSetting: useRestore,
        useDeleteForeverSetting: useDeleteForever,
        useBulkDeleteSetting: useBulkDelete,
        useBulkDeleteForeverSetting: useBulkDeleteForever,
        useBulkRestoreSetting: useBulkRestore,
    };
};
