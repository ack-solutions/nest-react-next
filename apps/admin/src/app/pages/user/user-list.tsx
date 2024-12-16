import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Button,
    Card,
    Tabs,
    Divider,
    Tab,
} from '@mui/material';
import { Icon, useToasty, useUserQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { DataTableColumn } from '@admin/app/components';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { useNavigate } from 'react-router-dom';
import ChangePasswordDialog from '@admin/app/sections/user/change-password-dialog';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';
import UserStatusLabel from '@admin/app/components/user/user-status-label';
import UserWithAvatar from '@admin/app/components/user/user-with-avatar';
import { startCase } from 'lodash';

const filterTabs = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: startCase(UserStatusEnum.ACTIVE),
        value: UserStatusEnum.ACTIVE,
    },
    {
        label: startCase(UserStatusEnum.INACTIVE),
        value: UserStatusEnum.INACTIVE,
    },
    {
        label: startCase(UserStatusEnum.PENDING),
        value: UserStatusEnum.PENDING,
    },
];

export default function UsersList() {
    const navigate = useNavigate();
    const datatableRef = useRef<CrudTableActions>(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState<any>()
    const [tabValue, setTabValue] = useState('all');
    const {
        useGetManyUser,
        useDeleteUser,
        useDeleteForeverUser,
        useBulkDeleteUser,
        useBulkDeleteForeverUser,
        useRestoreUser,
        useBulkRestoreUser
    } = useUserQuery();

    const handleOpenAddEditUser = useCallback(
        (row: IUser) => {
            navigate(`${PATH_DASHBOARD.users.edit}/${row?.id}`)
        },
        [],
    )

    const handleChangePassword = useCallback(
        (row: IUser) => {
            setOpenPasswordDialog(row)
        },
        [],
    )
    const handleCloseDialog = useCallback(
        () => {
            setOpenPasswordDialog(null)
        },
        [],
    )

    const handleTabChange = useCallback((_event, value) => {
        setTabValue(value)
        datatableRef.current.applyFilters((state) => ({
            ...state,
            where: {
                ...value != 'all' ? { status: { $eq: value } } : {},
            }
        }));
    }, [datatableRef]);

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

    return (
        <Page title='Users'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Users"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Users', href: PATH_DASHBOARD.users.root },
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
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{ px: 3 }}
                    >
                        {filterTabs.map((tab) => (
                            <Tab
                                key={tab.value}
                                iconPosition="end"
                                value={tab.value}
                                label={tab.label}
                                disableRipple
                            />
                        ))}
                    </Tabs>
                    <Divider />
                    <CrudTable
                        hasSoftDelete
                        crudName="Role"
                        crudOperationHooks={{
                            useGetMany: useGetManyUser,
                            useDelete: useDeleteUser,
                            useRestore: useRestoreUser,
                            useDeleteForever: useDeleteForeverUser,
                            useBulkDelete: useBulkDeleteUser,
                            useBulkRestore: useBulkRestoreUser,
                            useBulkDeleteForever: useBulkDeleteForeverUser,
                        }}
                        rowActions={(row) => ([
                            {
                                onClick: () => handleChangePassword(row),
                                icon: <Icon icon="lock-circle" />,
                                title: 'Change Password'
                            }
                        ])}
                        onEdit={handleOpenAddEditUser}
                        ref={datatableRef}
                        columns={columns}
                    />
                </Card>
            </Container>
            {openPasswordDialog && <ChangePasswordDialog onClose={handleCloseDialog} values={openPasswordDialog} />}
        </Page>
    );
}
