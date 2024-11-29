import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRoleQuery, useToasty } from '@libs/react-core';
import { IRole } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { DataTable, DataTableColumn, DataTableHandle, TableActionMenu } from '@admin/app/components';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';

export default function RoleList() {
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<DataTableHandle>(null);
    const [roleRequest, setRoleRequest] = useState()
    const { useGetManyRole, useDeleteRole } = useRoleQuery();
    const { data: roleData } = useGetManyRole(roleRequest, {
        enabled: !!roleRequest
    });
    const { mutate: onDeleteRole } = useDeleteRole()
    const handleOpenEditRole = useCallback(
        (row: IRole) => () => {
            navigate(`${PATH_DASHBOARD.users.editRole}/${row?.id}`)
        },
        [],
    )

    const handleDeleteUser = useCallback(
        (row: any) => {
            if (row.id) {
                deleteConfirm(
                    {
                        title: row.deletedAt ? "Permanent Delete" : "Delete",
                        message: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this role?`
                    })
                    .then(async () => {
                        try {
                            onDeleteRole(row.id, {
                                onError: (error) => {
                                    showToasty(error.message, 'error');
                                },
                                onSuccess: () => {
                                    showToasty('Role successfully deleted');
                                }
                            })
                            datatableRef?.current?.refresh();
                        } catch (error: any) {
                            showToasty(error, 'error');
                        }
                    })
                    .catch((error) => {
                        showToasty(error, 'error');
                    });
            }

        },
        [deleteConfirm, showToasty]
    );

    const handleDataTableChange = useCallback((filter: any) => {
        filter = {
            ...filter,
            s: {
                ...filter?.s,
            },
            relations: ['permissions']
        };
        setRoleRequest(filter)
    }, []);


    const columns: DataTableColumn<IRole>[] = [
        {
            name: 'name',
            label: 'Name',
            isSearchable: true,
        },
        {
            name: 'createdAt',
            label: 'Created Date',
            isSearchable: false,
            isSortable: true,
            render: (row) => toDisplayDate(row?.createdAt),
        },
        {
            name: 'action',
            label: 'Action',
            isAction: true,
            render: (row: any) => (
                <TableActionMenu
                    row={row}
                    onDelete={() => handleDeleteUser(row)}
                    {...!row?.deletedAt ? { onEdit: handleOpenEditRole(row) } : {}}
                />
            ),
            props: { sx: { width: 150 } }
        },
    ];

    return (
        <Page title='Roles'>
            <Container>
                <CustomBreadcrumbs
                    heading="Roles"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Roles', href: PATH_DASHBOARD.users.roles },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant='contained'
                            onClick={() => navigate(PATH_DASHBOARD.users.addRole)}
                        >
                            Add Role
                        </Button>
                    }
                />
                <DataTable
                    data={roleData?.items}
                    columns={columns}
                    ref={datatableRef}
                    totalRow={roleData?.total}
                    defaultOrder='desc'
                    defaultOrderBy='createdAt'
                    onChange={handleDataTableChange}
                />
            </Container>
        </Page>
    );
}


