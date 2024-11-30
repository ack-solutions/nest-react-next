import { SettingService, useCrudOperations } from '@libs/react-core';

const Service = SettingService.getInstance<SettingService>();

export const useSettingQuery = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(Service);

    return {
        useGetManySetting: useGetMany,
        useGetSettingById: useGetOne,
        useCreateSetting: useCreate,
        useDeleteSetting: useDelete,
        useUpdateSetting: useUpdate,
    };
};
