import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Stack,
    Typography,
    Button,
} from '@mui/material';
import { has, split, startCase } from 'lodash';
import { Icon, useToasty, useUserQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { DataTableHandle, DataTableColumn, TableActionMenu, DataTable, Label } from '@admin/app/components';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { useNavigate } from 'react-router-dom';
import ChangePasswordDialog from '@admin/app/sections/user/change-password-dialog';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';
import UserStatusLabel from '@admin/app/components/user/user-status-label';
import UserWithAvatar from '@admin/app/components/user/user-with-avatar';

export default function UsersList() {
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<CrudTableActions>(null);
    const [openPasswordDialog, setOpenPasswordDialog] = useState<any>()
    const [userRequest, setUserRequest] = useState();
    const {
        useGetManyUser,
        useDeleteUser,
        useDeleteForeverUser,
        useBulkDeleteUser,
        useBulkDeleteForeverUser,
        useRestoreUser,
        useBulkRestoreUser
    } = useUserQuery();
    const { mutate: onDeleteUser } = useDeleteUser()
    const { data: usersData } = useGetManyUser(userRequest, {
        enabled: !!userRequest
    })

    const handleViewUser = useCallback(
        (row: IUser) => {
            //
        },
        [navigate]
    );



    const handleRowClick = useCallback(
        (row: IUser) => {
            handleViewUser(row)
        },
        [handleViewUser]
    );

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
        // {
        //     name: 'action',
        //     label: 'Action',
        //     isAction: true,
        //     render: (row: any) => (
        //         <TableActionMenu
        //             row={row}
        //             {...!row?.deletedAt ? { onView: () => handleViewUser(row), onEdit: () => handleOpenAddEditUser(row) } : {}}
        //             actions={[{
        //                 onClick: () => handleChangePassword(row),
        //                 icon: <Icon icon="lock-circle" />,
        //                 title: 'Change Password'
        //             }]}
        //             {...!row?.isSuperAdmin ? { onDelete: () => handleDeleteUser(row) } : {}}
        //         />
        //     ),
        // },
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
            </Container>
            {openPasswordDialog && <ChangePasswordDialog onClose={handleCloseDialog} values={openPasswordDialog} />}
        </Page>
    );
}
