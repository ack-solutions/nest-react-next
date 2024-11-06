import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Container,
    Stack,
    Typography,
    MenuItem,
    TextField,
    FormControlLabel,
    Switch,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { has, split, startCase } from 'lodash';
import { DataTable, DataTableColumn, DataTableHandle, Icon, RoleService, TableActionMenu, useConfirm, UserService, useToasty } from '@mlm/react-core';
import { IRole, RoleNameEnum, UserStatusEnum } from '@mlm/types';
import { toDisplayDate } from '@mlm/utils';
import AddEditRoleDialog from '../../sections/role/add-edit-role-dialog';

const roleService = RoleService.getInstance<RoleService>();

interface ITableFilter {
    role?: RoleNameEnum | 'all';
    isTrashed?: boolean;
    status?: UserStatusEnum | 'all';
}

export default function RoleList() {
    const { showToasty } = useToasty();
    const [roles, setRoles] = useState<IRole[] | null>(null);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<DataTableHandle>(null);
    const [selectRole, setSelectRole] = useState<any>()

    const handleOpenAddEditRoleDialog = useCallback(
        (row: IRole) => () => {
            setSelectRole(row)
        },
        [],
    )
    const handleCloseAddEditRoleDialog = useCallback(
        () => {
            setSelectRole(null)
        },
        [],
    )
    const handleSubmitForm = useCallback(
        (value: IRole, action: any) => {
            console.log(value);
            
            if (value?.id) {
                roleService.update(value?.id, value).then(() => {
                    showToasty('Role updated Successfully')
                    action.setSubmitting(false)
                }).catch((error) => {
                    showToasty(error, 'error')
                })
            } else {
                roleService.create(value).then(() => {
                    action.setSubmitting(false)
                    showToasty('Role updated Successfully')
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
                        description: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this user?`
                    })
                    .then(async () => {
                        try {
                            if (row.deletedAt) {
                                await roleService.trashDelete(row.id)
                            }
                            else {
                                await roleService.delete(row.id).
                                    then(() => {
                                        // 
                                    })
                                    .catch((error) => {
                                        showToasty(error.message, 'error');
                                    });
                            }
                            datatableRef?.current?.refresh();
                            showToasty('User successfully deleted');
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
        roleService.getMany(filter).then((data) => {
            setRoles(data?.items || []);
            setTotal(data?.total || 0);
        });
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
                    {...!row?.deletedAt ? { onEdit: handleOpenAddEditRoleDialog(row) } : {}}
                />
            ),
        },
    ];

    return (
        // <Page title="Users">
        <Container maxWidth={false}>
            <DataTable
                data={roles}
                columns={columns}
                ref={datatableRef}
                totalRow={total}
                defaultOrder='desc'
                defaultOrderBy='createdAt'
                onChange={handleDataTableChange}
                detailRowTitle='Roles'
                topAction={<Button variant='contained' onClick={handleOpenAddEditRoleDialog({})}>Add Role</Button>}
            />

            {selectRole && <AddEditRoleDialog onSubmit={handleSubmitForm} onClose={handleCloseAddEditRoleDialog} roleValue={selectRole} />}
        </Container>
        // </Page>
    );
}


