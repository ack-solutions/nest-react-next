import { WhereOperatorEnum } from '@ackplus/nest-crud-request';
import { QueryBuilder } from '@ackplus/nest-crud-request';
import { useAuth, UserService, useUser } from '@libs/react-shared';
import { IUser, PermissionsEnum, RoleNameEnum, UserStatusEnum } from '@libs/types';
import { toDisplayDate, toDisplayPhone } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { filter, get, isEmpty, includes } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Page, Icon } from '../../components';
import { CrudTable, CrudTableActions } from '../../components/crud/crud-table';
import { DataTableColumn, DataTableTab, DataTableTabItem, IDataTableFilter } from '../../components/data-table';
import { IconEnum } from '../../components/icons/icons';
import UserStatusDropdown from '../../components/user/user-status-dropdown';
import UserStatusLabel from '../../components/user/user-status-label';
import UserWithAvatar from '../../components/user/user-with-avatar';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import ResetPasswordDialog from '../../sections/user/reset-password-dialog';
import UserMfaDialog from '../../sections/user/user-mfa-dialog';


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
    const datatableRef = useRef<CrudTableActions>(null);
    const [tableFilter, setTableFilter] = useState(defaultFilter);
    const [countFilter, setCountFilter] = useState({});
    const [resetPasswordUser, setResetPasswordUser] = useState<IUser | null>(null);
    const [mfaUser, setMfaUser] = useState<IUser | null>(null);
    const [canToggle, setCanToggle] = useState(false);

    // Permission checks
    const canCreate = useHasPermission(PermissionsEnum.CREATE_USERS);
    const canUpdate = useHasPermission(PermissionsEnum.UPDATE_USERS);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_USERS);
    const canResetPassword = useHasPermission(PermissionsEnum.RESET_PASSWORD_USERS);

    const {
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
        datatableRef.current?.datatable.refresh();
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
        setTableFilter((state) => {
            const newState = {
                ...state,
                [key]: value,
            };
            return newState;
        });
    }, []);

    const handleTrashData = useCallback((checked: boolean) => {
        setCountFilter((state) => {
            const newState = new QueryBuilder(state);
            newState.setOnlyDeleted(checked);
            return newState.toObject();
        });
    }, []);

    const handleDataTableApiRequestMap = useCallback(
        (queryBuilder: QueryBuilder, request: IDataTableFilter) => {
            if (tableFilter?.status !== 'all') {
                queryBuilder.where({
                    status: { $eq: tableFilter?.status },
                });
            }

            if (request?.search) {
                // TODO: need to fix search with concat firstName and lastName
                queryBuilder.orWhere('firstName', WhereOperatorEnum.ILIKE, `%${request?.search}%`);
                queryBuilder.orWhere('lastName', WhereOperatorEnum.ILIKE, `%${request?.search}%`);
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
            name: 'firstName',
            label: 'User Name',
            isSortable: true,
            render: (row) => (
                <UserWithAvatar
                    user={row}
                    secondaryText={row?.authUser?.email ? row?.authUser?.email : toDisplayPhone(row?.formattedPhone)}
                />
            ),
        },
        {
            name: 'authUser.email',
            label: 'Email',
            isSearchable: true,
            render: (row) => row?.authUser?.email,
        },
        {
            name: 'authUser.roles.name',
            label: 'Roles',
            isSearchable: true,
            render: (row) => row?.authUser?.roles?.map((role) => role.name).join(', '),
        },
        {
            name: 'status',
            label: 'Status',
            isSearchable: true,
            isSortable: true,
            render: (row) => (
                canUpdate ? (
                    <UserStatusDropdown
                        user={row}
                        onChange={(option) => handleUpdateStatus(option, row)}
                    />
                ) : (
                    <UserStatusLabel
                        user={row}
                        onChange={(option) => handleUpdateStatus(option, row)}
                    />
                )
            ),
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
                <CrudTable
                    crudName="User"
                    crudPermissionKey="users"
                    columns={columns}
                    ref={datatableRef}
                    hasSoftDelete
                    // Permission props
                    canEdit={canUpdate}
                    canDelete={canDelete}
                    canRestore={canDelete} // Usually same as delete permission
                    canDeleteForever={canDelete} // Usually same as delete permission
                    onToggleTrashData={handleTrashData}
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
                    onEdit={handleEditUser}
                    onRowClick={canUpdate ? handleRowClick : null}
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
                    filterSelectAll={row => {
                        const isSuperAdmin = !isEmpty(filter(row?.authUser?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)));
                        return (
                            !row?.isSuprUser && row?.id !== currentUser?.id && !isSuperAdmin
                        );
                    }}
                    checkBoxProps={(row, type) => {
                        const isSuperAdmin = !isEmpty(filter(row?.authUser?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)));
                        if (!(
                            !row?.isSuprUser && row?.id !== currentUser?.id && !isSuperAdmin
                        ) &&
                            type === 'row'
                        ) {
                            return { disabled: true };
                        }
                        return {};
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
