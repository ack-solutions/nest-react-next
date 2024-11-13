
import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PermissionService, useToasty } from '@libs/react-core';
import { IRole } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import AddEditPermissionDialog from '../../sections/user/add-edit-permission-dialog';
import { startCase } from 'lodash';
import { DataTableHandle, DataTableColumn, TableActionMenu, DataTable } from '@admin/app/components';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';

const permissionService = PermissionService.getInstance<PermissionService>();

export default function PermissionList() {
    const { showToasty } = useToasty();
    const [roles, setRoles] = useState<IRole[] | null>(null);
    const [total, setTotal] = useState(0);
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<DataTableHandle>(null);
    const [selectPermission, setSelectPermission] = useState<any>()

    const handleOpenAddEditRoleDialog = useCallback(
        (row: IRole) => () => {
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
        (value: IRole, action: any) => {
            if (value?.id) {
                permissionService.update(value?.id, value).then(() => {
                    showToasty('Permission updated Successfully')
                    action.setSubmitting(false)
                    handleCloseAddEditRoleDialog()
                    datatableRef?.current?.refresh();
                }).catch((error) => {
                    showToasty(error, 'error')
                })
            } else {
                permissionService.create(value).then(() => {
                    action.setSubmitting(false)
                    showToasty('Permission updated Successfully')
                    datatableRef?.current?.refresh();
                    handleCloseAddEditRoleDialog()
                }).catch((error) => {
                    showToasty(error, 'error')
                })
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
                        description: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this permission?`
                    })
                    .then(async () => {
                        try {
                            if (row.deletedAt) {
                                await permissionService.trashDelete(row.id)
                            }
                            else {
                                await permissionService.delete(row.id).
                                    then(() => {
                                        // 
                                    })
                                    .catch((error) => {
                                        showToasty(error.message, 'error');
                                    });
                            }
                            datatableRef?.current?.refresh();
                            showToasty('Permission successfully deleted');
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
        };
        permissionService.getMany(filter).then((data) => {
            setRoles(data?.items || []);
            setTotal(data?.total || 0);
        });
    }, []);

    const columns: DataTableColumn<IRole>[] = [
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
                    {...!row?.deletedAt ? { onEdit: handleOpenAddEditRoleDialog(row) } : {}}
                />
            ),
        },
    ];

    return (
        <Page title='Permission'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Permission"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Permission', href: PATH_DASHBOARD.users.permissions },
                        { name: 'List' },
                    ]}
                    action={
                        <Button variant='contained' onClick={handleOpenAddEditRoleDialog({})}>Add Permission</Button>
                    }
                />
                <DataTable
                    data={roles}
                    columns={columns}
                    ref={datatableRef}
                    totalRow={total}
                    defaultOrder='desc'
                    defaultOrderBy='createdAt'
                    onChange={handleDataTableChange}
                />
                {selectPermission && <AddEditPermissionDialog onSubmit={handleSubmitForm} onClose={handleCloseAddEditRoleDialog} values={selectPermission} />}

            </Container>

        </Page>
    );
}


