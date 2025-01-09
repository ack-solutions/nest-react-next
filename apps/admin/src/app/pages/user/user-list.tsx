import { DataTableColumn } from '@admin/app/components';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import DataTableTab, { DataTableTabItem } from '@admin/app/components/data-table/data-table-tab';
import Page from '@admin/app/components/page';
import UserStatusLabel from '@admin/app/components/user/user-status-label';
import UserWithAvatar from '@admin/app/components/user/user-with-avatar';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import ChangePasswordDialog from '@admin/app/sections/user/change-password-dialog';
import { TextFieldRaw, useUserQuery } from '@libs/react-core';
import { IUser, RoleNameEnum, UserStatusEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import LockResetIcon from '@mui/icons-material/LockReset';
import {
    Container,
    Button,
    Card,
    MenuItem,
} from '@mui/material';
import { has, split, startCase } from 'lodash';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export interface IUserTableFilter {
    role?: RoleNameEnum | 'all';
    status?: UserStatusEnum | 'all';
}

const defaultFilter: IUserTableFilter = {
    role: 'all',
    status: 'all',
};

export default function UsersList() {
    const navigate = useNavigate();
    const datatableRef = useRef<CrudTableActions>(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState<any>();
    const [tableFilter, setTableFilter] = useState<IUserTableFilter>(defaultFilter);
    const {
        useGetManyUser,
        useDeleteUser,
        useDeleteForeverUser,
        useBulkDeleteUser,
        useBulkDeleteForeverUser,
        useRestoreUser,
        useBulkRestoreUser,
        useGetUserCountByStatus,
    } = useUserQuery();

    const { data: countByStatus } = useGetUserCountByStatus();

    const handleOpenAddEditUser = useCallback(
        (row: IUser) => {
            navigate(`${PATH_DASHBOARD.users.edit}/${row?.id}`);
        },
        [navigate],
    );

    const handleChangePassword = useCallback(
        (row: IUser) => {
            setOpenPasswordDialog(row);
        },
        [],
    );
    const handleCloseDialog = useCallback(
        () => {
            setOpenPasswordDialog(null);
        },
        [],
    );

    const handleOnChangeTableFilter = useCallback(
        (value, key) => {
            setTableFilter((state) => {
                const newState = {
                    ...state,
                    [key]: value,
                };
                return newState;
            });
        },
        [],
    );

    const handleDataTableApiRequestMap = useCallback(
        (filter) => {
            if (has(filter?.where, '$or') && filter?.where['$or']?.length > 0) {
                const searches = split(filter?.where['$or'][0]['firstName']['$contL'], ' ');
                if (searches?.length > 1) {
                    filter?.where['$or'].push({
                        firstName: { $contL: searches[0]?.trim() },
                        lastName: { $contL: searches[1]?.trim() },
                    });

                    filter?.where['$or'].push({
                        firstName: { $contL: searches[1]?.trim() },
                        lastName: { $contL: searches[0]?.trim() },
                    });
                }
            }
            filter = {
                ...filter,
                where: {
                    ...filter?.where,
                    ...tableFilter?.role !== 'all' ? { 'roles.name': { $in: [tableFilter?.role] } } : {},
                    ...tableFilter?.status !== 'all' ? { status: { $eq: tableFilter?.status } } : {},
                },
                relations: ['roles'],
            };

            return filter;
        },
        [tableFilter?.role, tableFilter?.status],
    );

    const tabs: DataTableTabItem[] = useMemo(() => {
        return [
            {
                value: 'all',
                label: 'All',
                count: countByStatus?.all || 0,
            },
            {
                value: UserStatusEnum.ACTIVE,
                label: 'Active',
                color: 'success',
                count: countByStatus?.[UserStatusEnum.ACTIVE] || 0,
            },
            {
                value: UserStatusEnum.INACTIVE,
                label: 'Inactive',
                color: 'error',
                count: countByStatus?.[UserStatusEnum.INACTIVE] || 0,
            },
            {
                value: UserStatusEnum.PENDING,
                label: 'Pending',
                color: 'warning',
                count: countByStatus?.[UserStatusEnum.PENDING] || 0,
            },
        ];
    }, [countByStatus]);

    const columns: DataTableColumn<IUser>[] = [
        {
            name: 'firstName',
            label: 'User Name',
            isSearchable: true,
            isSortable: true,
            render: (row) => (<UserWithAvatar user={row} />),
        },

        {
            name: 'email',
            label: 'Email',
            isSearchable: true,
            isSortable: true,
            render: (row) => row?.email,
        },
        {
            name: 'roles.name',
            label: 'Roles',
            isSearchable: true,
            isSortable: true,
            render: (row) => (row?.roles)?.map((role) => role.name).join(', '),
        },
        {
            name: 'status',
            label: 'Status',
            render: (row) => (<UserStatusLabel label={row?.status} />),
        },
        {
            name: 'createdAt',
            label: 'Created Date',
            isSearchable: false,
            isSortable: true,
            render: (row) => toDisplayDate(row?.createdAt),
        },
    ];

    useEffect(() => {
        if (datatableRef.current) {
            datatableRef.current.datatable.refresh();
        }
    }, [tableFilter]);

    return (
        <Page title='Users'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Users"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Users',
                            href: PATH_DASHBOARD.users.root,
                        },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant='contained'
                            onClick={() => navigate(`${PATH_DASHBOARD.users.add}`)}
                        >
                            Add User
                        </Button>
                    }
                />
                <Card>
                    <DataTableTab
                        tabs={tabs}
                        value={tableFilter.status}
                        onChange={(tab) => handleOnChangeTableFilter(tab, 'status')}
                    />
                    <CrudTable
                        crudName={'User'}
                        columns={columns}
                        ref={datatableRef}
                        hasSoftDelete
                        dataTableApiRequestMap={handleDataTableApiRequestMap}
                        crudOperationHooks={{
                            useGetMany: useGetManyUser,
                            useDelete: useDeleteUser,
                            useRestore: useRestoreUser,
                            useDeleteForever: useDeleteForeverUser,
                            useBulkDelete: useBulkDeleteUser,
                            useBulkRestore: useBulkRestoreUser,
                            useBulkDeleteForever: useBulkDeleteForeverUser,
                        }}
                        onEdit={handleOpenAddEditUser}
                        rowActions={(row) => {
                            return [
                                {
                                    icon: <LockResetIcon />,
                                    title: 'Change Password',
                                    onClick: () => handleChangePassword(row),
                                },

                            ];
                        }}
                        onRowClick={handleOpenAddEditUser}
                        extraFilter={(
                            <TextFieldRaw
                                select
                                size="small"
                                label="Status"
                                value={tableFilter?.status}
                                onChange={({ target }) => handleOnChangeTableFilter(target?.value, 'status')}
                                sx={{ width: 150 }}
                            >
                                <MenuItem value={'all'}>All Status</MenuItem>
                                {Object.values(UserStatusEnum)?.map((status) => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >{startCase(status)}</MenuItem>
                                ))}
                            </TextFieldRaw>
                        )}
                    />
                </Card>
            </Container>
            {openPasswordDialog && <ChangePasswordDialog
                onClose={handleCloseDialog}
                values={openPasswordDialog}
            />}
        </Page>
    );
}
