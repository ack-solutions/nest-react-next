import { WhereOperatorEnum } from '@ackplus/nest-crud-request';
import { QueryBuilder } from '@ackplus/nest-crud-request';
import { useAuth, UserService, useUser } from '@libs/react-shared';
import { IUser, PermissionsEnum, RoleNameEnum, UserStatusEnum } from '@libs/types';
import { toDisplayDateTime } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { filter, get, isEmpty, includes, startCase } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Page, Icon, DataTableTabItem, DataTableTab } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import UserStatusDropdown from '../../components/user/user-status-dropdown';
import UserStatusLabel from '../../components/user/user-status-label';
import UserWithAvatar from '../../components/user/user-with-avatar';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import ResetPasswordDialog from '../../sections/user/reset-password-dialog';
import UserMfaDialog from '../../sections/user/user-mfa-dialog';
import CrudDataGrid from '@admin/app/components/data-grid/crud-data-grid';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { useDataTableState } from '@admin/app/contexts/datatable-state-context';
import { searchBySplitName } from '@admin/app/utils/builder';
import { toDisplayPhone } from '@admin/app/utils/phone';


export interface IUserTableFilter {
    role?: RoleNameEnum | 'all';
    status?: UserStatusEnum | 'all';
}

const defaultFilter: IUserTableFilter = {
    role: 'all',
    status: 'all',
};

const userService = UserService.getInstance<UserService>();

function UsersList() {
    const { currentUser } = useAuth();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const datatableRef = useRef<DataTableApi<IUser>>(null);

    // Get cached state for products table
    const dataTableStateKey = 'userlist';
    const { state: cachedState, setState: setCachedState } = useDataTableState(dataTableStateKey);

    const [tableFilter, setTableFilter] = useState(cachedState?.tableFilter || defaultFilter);
    const [countFilter, setCountFilter] = useState(cachedState?.countFilter || {});
    const [resetPasswordUser, setResetPasswordUser] = useState<IUser | null>(null);
    const [mfaUser, setMfaUser] = useState<IUser | null>(null);
    const [canToggle, setCanToggle] = useState(false);


    // Permission checks
    const canCreate = useHasPermission(PermissionsEnum.CREATE_USERS);
    const canUpdate = useHasPermission(PermissionsEnum.UPDATE_USERS);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_USERS);
    const canResetPassword = useHasPermission(PermissionsEnum.RESET_PASSWORD_USERS);

    const {
        useFetchManyUser,
        useGetManyUser,
        useDeleteUser,
        useRestoreUser,
        useDeleteForeverUser,
        useBulkDeleteUser,
        useBulkRestoreUser,
        useBulkDeleteForeverUser,
        useUpdateUser,
        useGetUserCounts,
    } = useUser();

    const { mutateAsync: updateUser } = useUpdateUser();

    const { data: counts } = useGetUserCounts({
        filter: countFilter,
        groupByKey: 'status',
    });

    const handleEditUser = useCallback(
        (user: IUser) => {
            navigate(PATH_DASHBOARD.users.edit(user.id));
        },
        [navigate],
    );

    const handleRowClick = useCallback(
        (row: IUser) => {
            navigate(`${PATH_DASHBOARD.users.view}/${row?.id}`);
        },
        [navigate],
    );

    const handleResetPassword = useCallback(
        (user: IUser) => {
            setResetPasswordUser(user);
        },
        [],
    );

    const handleCloseResetPasswordDialog = useCallback(() => {
        setResetPasswordUser(null);
    }, []);

    const checkCanMenageTotp = useCallback(
        async () => {
            try {
                const canToggleResponse = await userService.canToggleMfa();
                setCanToggle(canToggleResponse.access);
            } catch (error) {
                console.error('Error checking MFA toggle permission:', error);
                setCanToggle(false);
            }
        },
        [],
    );

    const handleManageMfa = useCallback(
        (user: IUser) => {
            setMfaUser(user);
        },
        [],
    );

    const handleCloseMfaDialog = useCallback(() => {
        setMfaUser(null);
    }, []);

    const handleMfaChanged = useCallback(() => {
        // Refresh the datatable when MFA settings change
        datatableRef.current?.data.reload();
    }, []);

    const handleUpdateStatus = useCallback(
        (value: UserStatusEnum, row: IUser) => {
            const request: any = {
                id: row.id,
                status: value,
            };
            updateUser(request).then(() => {
                showToasty('Status update successfully');
            }).catch((error) => {
                showToasty(error, 'error');
            });
        },
        [showToasty, updateUser],
    );

    const handleOnChangeTableFilter = useCallback((value: any, key: string) => {
        setCachedState({ tableFilter: { ...tableFilter, [key]: value } })
        setTableFilter((state) => {
            const newState = {
                ...state,
                [key]: value,
            };
            return newState;
        });
    }, [tableFilter]);

    const handleTrashData = useCallback((checked: boolean) => {
        setCountFilter((state) => {
            const newState = new QueryBuilder(state);
            newState.setOnlyDeleted(checked);
            return newState.toObject();
        });
        setCachedState({ countFilter: { ...countFilter, onlyDeleted: checked } })
    }, [countFilter]);

    const dataTableApiRequestMap = useCallback(
        async (queryBuilder: QueryBuilder, filters: any) => {
            if (tableFilter?.status !== 'all') {
                queryBuilder.where({
                    status: { $eq: tableFilter?.status },
                });
            }
            if (filters?.search) {
                searchBySplitName(queryBuilder, filters?.search, ['firstName', 'lastName']);
            }

            queryBuilder.addRelation('authUser');
            queryBuilder.addRelation('authUser.roles');
            return queryBuilder;
        },
        [tableFilter?.status],
    );

    const tabs: DataTableTabItem[] = useMemo(() => {
        const statusByCount = counts?.data.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {});

        return [
            {
                value: 'all',
                label: 'All',
                count: counts?.total || 0,
            },
            {
                value: UserStatusEnum.ACTIVE,
                label: 'Active',
                color: 'success',
                count: get(statusByCount, UserStatusEnum.ACTIVE, 0),
            },
            {
                value: UserStatusEnum.PENDING,
                label: 'Pending',
                color: 'warning',
                count: get(statusByCount, UserStatusEnum.PENDING, 0),
            },
            {
                value: UserStatusEnum.INACTIVE,
                label: 'Inactive',
                color: 'error',
                count: get(statusByCount, UserStatusEnum.INACTIVE, 0),
            },
        ];
    }, [counts]);

    const columns: DataTableColumn<IUser>[] = [
        {
            accessorKey: 'firstName',
            header: 'User Name',
            enableGlobalFilter: true,
            enableSorting: true,
            accessorFn: (row) => row.name,
            cell: ({ row }) => (
                <UserWithAvatar
                    user={row.original}
                    secondaryText={row.original?.authUser?.email ? row.original?.authUser?.email : toDisplayPhone(row.original?.formattedPhone)}
                />
            ),
        },
        {
            accessorKey: 'authUser.email',
            header: 'Email',
            enableGlobalFilter: true,
            enableSorting: true,
        },
        {
            accessorKey: 'phoneNumber',
            header: 'Phone Number',
            enableGlobalFilter: true,
            enableSorting: true,
            accessorFn: (row) => toDisplayPhone(row.formattedPhone),
        },
        {
            accessorKey: 'authUser.roles.name',
            header: 'Roles',
            enableSorting: true,
            cell: ({ row }) => row.original?.authUser?.roles?.map((role: any) => role.name).join(', '),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: true,
            accessorFn: (row) => startCase(row.status),
            type: 'select',
            options: Object.values(UserStatusEnum).map((status) => ({
                label: startCase(status),
                value: status,
            })),
            cell: ({ row }) => (
                canUpdate ? (
                    <UserStatusDropdown
                        user={row.original}
                        onChange={(option) => handleUpdateStatus(option, row.original)}
                    />
                ) : (
                    <UserStatusLabel
                        user={row.original}
                        onChange={(option) => handleUpdateStatus(option, row.original)}
                    />
                )
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created Date',
            enableSorting: true,
            type: 'date',
            accessorFn: (row) => toDisplayDateTime(row.createdAt),
        },
    ];

    useEffect(() => {
        if (datatableRef.current) {
            datatableRef.current.data.reload();
        }
    }, [tableFilter?.status]);

    useEffect(() => {
        checkCanMenageTotp();
    }, []);

    // Check if current user is super admin (for MFA management access)
    const isCurrentUserSuperAdmin = useMemo(() => {
        return !isEmpty(filter(currentUser?.authUser?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)));
    }, [currentUser]);

    return (
        <Page
            title="Users"
            breadcrumbs={[
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
        >
            <Card>
                <DataTableTab
                    tabs={tabs}
                    value={tableFilter?.status}
                    onChange={(tab) => handleOnChangeTableFilter(tab, 'status')}
                />
                <CrudDataGrid
                    ref={datatableRef}
                    columns={columns}
                    crudName="Product"
                    stateKey={dataTableStateKey}
                    exportFilename="products"
                    onToggleTrashData={handleTrashData}
                    dataTableApiRequestMap={dataTableApiRequestMap}
                    isRowSelectable={({ row }) => {
                        const isSuperAdmin = !isEmpty(filter(row?.authUser?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)));
                        return (
                            !!(row?.id !== currentUser?.id && !isSuperAdmin)
                        );
                    }}
                    crudOperationHooks={{
                        fetchMany: useFetchManyUser,
                        useGetMany: useGetManyUser,
                        useDelete: useDeleteUser,
                        useRestore: useRestoreUser,
                        useDeleteForever: useDeleteForeverUser,
                        useBulkDelete: useBulkDeleteUser,
                        useBulkRestore: useBulkRestoreUser,
                        useBulkDeleteForever: useBulkDeleteForeverUser,
                    }}

                    tableActionMenuProps={
                        (row) => {
                            const isCurrentUser = row?.id === currentUser?.id;
                            const canDeleteUser = canDelete && !isCurrentUser;
                            const canResetUserPassword = canResetPassword && !isCurrentUser;

                            // Build actions array
                            const actions: any[] = [];

                            // Reset password action
                            if (canResetUserPassword) {
                                actions.push({
                                    icon: <Icon icon={IconEnum.Key} />,
                                    title: 'Reset Password',
                                    onClick: () => handleResetPassword(row),
                                });
                            }

                            // MFA management action (for super admins only)
                            if (canToggle) {
                                actions.push({
                                    icon: <Icon icon={IconEnum.Shield} />,
                                    title: 'Manage MFA',
                                    onClick: () => handleManageMfa(row),
                                });
                            }

                            return {
                                // Override delete permission for specific users
                                ...(canDeleteUser ? {} : {
                                    onDelete: null,
                                    onDeleteForever: null,
                                }),
                                // Add actions
                                ...(actions.length > 0 ? { actions } : {}),
                            };
                        }
                    }
                    initialState={{
                        sorting: [
                            {
                                id: 'createdAt',
                                desc: true,
                            },
                        ],
                    }}
                    hasSoftDelete
                    onEdit={handleEditUser}
                    onView={handleRowClick}
                    onRowClick={canUpdate ? handleRowClick : null}
                    enableGlobalFilter={true}
                    permissionsKey={{
                        delete: PermissionsEnum.DELETE_USERS,
                        deleteForever: PermissionsEnum.DELETE_USERS,
                        restore: PermissionsEnum.DELETE_USERS,
                        edit: PermissionsEnum.UPDATE_USERS,
                        view: PermissionsEnum.ACCESS_USERS,
                    }}
                    extraFilter={canCreate ? (
                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.users.create}
                            variant="contained"
                        >
                            New User
                        </Button>
                    ) : null}
                />
            </Card>

            <ResetPasswordDialog
                open={!!resetPasswordUser}
                onClose={handleCloseResetPasswordDialog}
                user={resetPasswordUser}
            />

            <UserMfaDialog
                open={!!mfaUser}
                onClose={handleCloseMfaDialog}
                user={mfaUser}
                onMfaChanged={handleMfaChanged}
            />
        </Page>
    );
}

export default withRequirePermission(UsersList, {
    permission: PermissionsEnum.ACCESS_USERS,
});
