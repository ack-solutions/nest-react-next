import { QueryBuilder } from '@ackplus/nest-crud-request';
import { useUser } from '@libs/react-shared';
import {
    IUser,
    PermissionsEnum,
    RoleGuardEnum,
    RoleNameEnum,
    UserStatusEnum,
} from '@libs/types';
import { toDisplayDate, toDisplayPhone } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { filter, get, includes, isEmpty } from 'lodash';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
    CrudTable,
    CrudTableActions,
    Page,
} from '../../components';
import {
    DataTableColumn,
    DataTableTab,
    DataTableTabItem,
} from '../../components/data-table';
import UserStatusDropdown from '../../components/user/user-status-dropdown';
import UserWithAvatar from '../../components/user/user-with-avatar';
import { useAccess, useAuth, withPermission } from '../../contexts';
import { useToasty } from '../../hook/use-toasty';
import { PATH_DASHBOARD } from '../../routes/paths';


export interface IUserTableFilter {
    role?: RoleNameEnum | 'all';
    status?: UserStatusEnum | 'all';
}

const defaultFilter: IUserTableFilter = {
    role: 'all',
    status: 'all',
};

function UsersList() {
    const { currentUser } = useAuth();
    const { showToasty } = useToasty();
    const { hasPermission } = useAccess();
    const navigate = useNavigate();
    const datatableRef = useRef<CrudTableActions>(null);
    const [tableFilter, setTableFilter] = useState(defaultFilter);
    const [countFilter, setCountFilter] = useState({});

    const canCreate = hasPermission(PermissionsEnum.CREATE_USERS);
    const canUpdate = hasPermission(PermissionsEnum.UPDATE_USERS);
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
        (user) => {
            navigate(PATH_DASHBOARD.users.edit(user.id));
        },
        [navigate],
    );

    const handleRowClick = useCallback(
        (row) => {
            navigate(`${PATH_DASHBOARD.users.view}/${row?.id}`);
        },
        [navigate],
    );

    const handleUpdateStatus = useCallback(
        (value: UserStatusEnum, row) => {
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


    const handleOnChangeTableFilter = useCallback((value, key) => {
        setTableFilter((state) => {
            const newState = {
                ...state,
                [key]: value,
            };
            return newState;
        });
    }, []);

    const handleTrashData = useCallback((checked) => {
        setCountFilter((state) => {
            const newState = new QueryBuilder(state);
            newState.setOnlyDeleted(checked);
            return newState.toObject();
        });
    }, []);

    const handleDataTableApiRequestMap = useCallback(
        (queryBuilder: QueryBuilder, request) => {
            if (tableFilter?.status !== 'all') {
                queryBuilder.where({
                    status: { $eq: tableFilter?.status },
                });
            }
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
            render: (row) => row?.authUser?.email,
        },
        {
            name: 'authUser.roles.name',
            label: 'Roles',
            render: (row) => row?.authUser?.roles?.map((role) => role.name).join(', '),
        },
        {
            name: 'status',
            label: 'Status',
            isSearchable: true,
            isSortable: true,
            render: (row) => (
                <UserStatusDropdown
                    user={row}
                    onChange={(option) => handleUpdateStatus(option, row)}
                />
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
                        (row) => (
                            row?.id === currentUser?.id ||
                            !isEmpty(filter(row?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name))))
                            && { onDelete: null }
                    }
                    filterSelectAll={row => {
                        return (
                            !row?.isSuprUser && row?.id !== currentUser?.id && isEmpty(filter(row?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)))
                        );
                    }}
                    checkBoxProps={(row, type) => {
                        if (!(
                            !row?.isSuprUser && row?.id !== currentUser?.id &&
                            isEmpty(filter(row?.roles, role => includes([RoleNameEnum.SUPER_ADMIN], role.name)))
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
        </Page>
    );
}

export default withPermission({
    roles: RoleGuardEnum.ADMIN,
    permissions: [PermissionsEnum.ACCESS_USERS],
})(UsersList);
