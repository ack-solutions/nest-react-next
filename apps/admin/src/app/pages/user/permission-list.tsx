
import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Button,
} from '@mui/material';
import { PermissionService, usePermissionQuery, useToasty } from '@libs/react-core';
import { IPermission, IRole } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import AddEditPermissionDialog from '../../sections/user/add-edit-permission-dialog';
import { startCase } from 'lodash';
import { DataTableHandle, DataTableColumn, TableActionMenu, DataTable } from '@admin/app/components';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';

export default function PermissionList() {
    const { showToasty } = useToasty();
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<DataTableHandle>(null);
    const [selectPermission, setSelectPermission] = useState<any>()
    const [permissionRequest, setsPermissionRequest] = useState();
    const { useGetManyPermission, useUpdatePermission, useCreatePermission, useDeletePermission } = usePermissionQuery();
    const { mutate: createPermission } = useCreatePermission()
    const { mutate: updatePermission } = useUpdatePermission()
    const { mutate: deletePermission } = useDeletePermission()

    const { data: permissionData } = useGetManyPermission(permissionRequest, {
        select: (data) => {
            const updatedData = data?.items?.map((item: any) => ({
                ...item,
                roles: item.roles.map((role: any) => role.id),
            }));
            return {
                ...data,
                items: updatedData,
            };
        },
    })

    const handleOpenAddEditRoleDialog = useCallback(
        (row: IRole) => {
            setSelectPermission(row)
        },
        [],
    )

    const handleCloseAddEditRoleDialog = useCallback(
        () => {
            setSelectPermission(null)
        },
        [],
    )

    const handleSubmitForm = useCallback(
        (value: IPermission) => {
            const options = {
                onSuccess: (data) => {
                    showToasty(
                        value?.id
                            ? 'Permission updated successfully'
                            : 'Permission added successfully'
                    );
                    handleCloseAddEditRoleDialog()
                    datatableRef?.current?.refresh();
                },
                onError: (error) => {
                    console.log(error)
                    showToasty(error, 'error');
                }
            }

            if (value?.id) {
                updatePermission(value, options);
            } else {
                createPermission(value, options);
            }
        },
        [],
    )

    const handleDeleteUser = useCallback(
        (row: any) => {
            if (row.id) {
                deleteConfirm(
                    {
                        title: row.deletedAt ? "Permanent Delete" : "Delete",
                        message: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this permission?`
                    })
                    .then(async () => {
                        try {
                            deletePermission(row.id, {
                                onError: (error) => {
                                    showToasty(error.message, 'error');
                                },
                                onSuccess: () => {
                                    showToasty('Permission successfully deleted');
                                }
                            })
                            datatableRef?.current?.refresh();
                        } catch (error: any) {
                            showToasty(error, 'error');
                        }
                    })
                    .catch(() => {
                        //
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
            relations: ['roles'],
        };
        setsPermissionRequest(filter)
    }, []);

    const columns: DataTableColumn<IPermission>[] = [
        {
            name: 'name',
            label: 'Name',
            isSearchable: true,
            render: (row) => startCase(row?.name),
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
                    {...!row?.deletedAt ? { onEdit: () => handleOpenAddEditRoleDialog(row) } : {}}
                />
            ),
            props: { sx: { width: 150 } }
        },
    ];

    return (
        <Page title='Permissions'>
            <Container>
                <CustomBreadcrumbs
                    heading="Permissions"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Permissions', href: PATH_DASHBOARD.users.permissions },
                        { name: 'List' },
                    ]}
                    action={
                        <Button variant='contained' onClick={() => handleOpenAddEditRoleDialog({})}>Add Permission</Button>
                    }
                />
                <DataTable
                    data={permissionData?.items}
                    columns={columns}
                    ref={datatableRef}
                    totalRow={permissionData?.total}
                    defaultOrder='desc'
                    defaultOrderBy='createdAt'
                    onChange={handleDataTableChange}
                    onRowClick={handleOpenAddEditRoleDialog}
                />
                {selectPermission && (
                    <AddEditPermissionDialog
                        onSubmit={handleSubmitForm}
                        onClose={handleCloseAddEditRoleDialog}
                        values={!!selectPermission && selectPermission}
                    />)
                }
            </Container>
        </Page>
    );
}


