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

export default function UsersList() {
  const { showToasty } = useToasty();
  const navigate = useNavigate();
  const deleteConfirm = useConfirm();
  const datatableRef = useRef<DataTableHandle>(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState<any>()
  const [userRequest, setUserRequest] = useState();
  const { useGetManyUser, useDeleteUser } = useUserQuery();
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

  const handleDeleteUser = useCallback(
    (row: IUser) => {
      if (row.id) {
        deleteConfirm(
          {
            title: row.deletedAt ? "Permanent Delete" : "Delete",
            message: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this user?`
          })
          .then(async () => {
            try {
              onDeleteUser(row.id, {
                onError: (error) => {
                  showToasty(error.message, 'error');
                },
                onSuccess: () => {
                  showToasty('User successfully deleted');
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

  const handleDataTableChange = useCallback((filter: any) => {
    if (has(filter?.s, '$or') && filter?.s['$or']?.length > 0) {
      const searches = split(filter?.s['$or'][0]['firstName']['$contL'], ' ')
      if (searches?.length > 1) {
        filter?.s['$or'].push({
          firstName: { $contL: searches[0]?.trim() }, lastName: { $contL: searches[1]?.trim() }
        })

        filter?.s['$or'].push({
          firstName: { $contL: searches[1]?.trim() }, lastName: { $contL: searches[0]?.trim() }
        })
      }
    }
    filter = {
      ...filter,
      s: {
        ...filter?.s,
      },
      relations: ['roles'],
    };
    setUserRequest(filter)
  }, []);

  const columns: DataTableColumn<IUser>[] = [
    {
      name: 'firstName',
      label: 'User Name',
      isSearchable: true,
      isSortable: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2" noWrap>
            {startCase(row?.name)}
          </Typography>
        </Stack>
      ),
    },
    {
      name: 'lastName',
      label: 'Last Name',
      isSearchable: true,
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
      render: (row) => (
        <Label
          variant='soft'
          color={row?.status === UserStatusEnum.ACTIVE ? 'success' : 'warning'}
        >
          {startCase(row?.status)}
        </Label>
      ),
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
          {...!row?.deletedAt ? { onView: () => handleViewUser(row), onEdit: () => handleOpenAddEditUser(row) } : {}}
          actions={[{
            onClick: () => handleChangePassword(row),
            icon: <Icon icon="lock-circle" />,
            title: 'Change Password'
          }]}
          {...!row?.isSuperAdmin ? { onDelete: () => handleDeleteUser(row) } : {}}
        />
      ),
    },
  ];

  return (
    <Page title='Users'>
      <Container>
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
        <DataTable
          data={usersData?.items}
          columns={columns}
          ref={datatableRef}
          totalRow={usersData?.total}
          defaultOrder='desc'
          defaultOrderBy='createdAt'
          onChange={handleDataTableChange}
          onRowClick={handleRowClick}
          hasFilter
          selectable
        />
      </Container>
      {openPasswordDialog && <ChangePasswordDialog onClose={handleCloseDialog} values={openPasswordDialog} />}
    </Page>
  );
}


