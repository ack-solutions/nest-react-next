import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Container,
  Stack,
  Typography,
  MenuItem,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { has, split, startCase } from 'lodash';
import { DataTable, DataTableColumn, DataTableHandle, Icon, TableActionMenu, useConfirm, UserService, useToasty } from '@mlm/react-core';
import { IUser, RoleNameEnum, UserStatusEnum } from '@mlm/types';
import { toDisplayDate } from '@mlm/utils';

const userService = UserService.getInstance<UserService>();
interface ITableFilter {
  role?: RoleNameEnum | 'all';
  isTrashed?: boolean;
  status?: UserStatusEnum | 'all';
}

export default function UsersList() {
  const { showToasty } = useToasty();
  const [users, setUsers] = useState<IUser[] | null>(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const deleteConfirm = useConfirm();
  const datatableRef = useRef<DataTableHandle>(null);
  const [selectedUser, setSelectedUser] = useState<any>()
  const [tableFilter, setTableFilter] = useState<ITableFilter>({
    role: 'all',
    isTrashed: false,
    status: 'all'
  })


  const handleViewUser = useCallback(
    (row: IUser) => {
      //navigate(`${PATH_DASHBOARD.users.view}/${row?.id}?tab=documents`);
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
      setSelectedUser(row)
    },
    [],
  )

  // const handleCloseAddEditUser = useCallback(
  //   (isRefresh) => {
  //     if (isRefresh) {
  //       datatableRef?.current?.refresh(true);
  //     }
  //     setSelectedUser(null)
  //   },
  //   [],
  // )

  // const handleUpdateStatus = useCallback(
  //   (row: IUser) => (event: any) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     deleteConfirm(
  //       {
  //         title: row.status === UserStatusEnum.ACTIVE ? 'Suspend' : 'Active',
  //         description: `Are you sure you want to ${row.status === UserStatusEnum.ACTIVE ? 'suspend' : 'active'} this user?`,
  //         yesButtonProps: {
  //           color: row.status === UserStatusEnum.ACTIVE ? 'error' : 'primary',
  //         },
  //         yesText: row.status === UserStatusEnum.ACTIVE ? 'Suspend' : 'Active',
  //       })
  //       .then(() => {
  //         userService
  //           .update(row?.id, { status: row.status === UserStatusEnum.ACTIVE ? UserStatusEnum.INACTIVE : UserStatusEnum.ACTIVE })
  //           .then(() => {
  //             datatableRef?.current?.refresh();
  //           })
  //           .catch((error) => {
  //             showToasty(error.message, 'error');
  //           });
  //       })
  //       .catch(() => {
  //         //nothing.
  //       });
  //   },
  //   [deleteConfirm, showToasty],
  // )

  // const handleDeleteUser = useCallback(
  //   (row: IUser) => {
  //     deleteConfirm(
  //       {
  //         title: row.deletedAt ? "Permanent Delete" : "Delete",
  //         description: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this user?`
  //       })
  //       .then(async () => {
  //         try {
  //           if (row.deletedAt) {
  //             await userService.trashDelete(row.id)
  //           }
  //           else {
  //             await userService.delete(row.id).
  //               then(() => {
  //                 // 
  //               })
  //               .catch((error) => {
  //                 showToasty(error.message, 'error');
  //               });
  //           }
  //           datatableRef?.current?.refresh();
  //           showToasty('User successfully deleted');
  //         } catch (error: any) {
  //           showToasty(error, 'error');
  //         }
  //       })
  //       .catch(() => {
  //         //
  //       });
  //   },
  //   [deleteConfirm, showToasty]
  // );
  const handleRestoreDelete = useCallback(
    (row: IUser) => {
      deleteConfirm(
        {
          title: "Restore",
          yesText: "Restore",
          yesButtonProps: { color: 'primary' },
          description: `Are you sure you want to restore this user?`
        })
        .then(async () => {
          try {
            // await userService.restoreTrashed(row?.id)
            datatableRef?.current?.refresh();
            showToasty('User successfully deleted');
          } catch (error: any) {
            showToasty(error, 'error');
          }
        })
        .catch(() => {
          //
        });
    },
    [deleteConfirm, showToasty]
  );

  const handleOnChangeTableFilter = useCallback(
    (value: any, key: any) => {
      setTableFilter((state) => {
        const newState = {
          ...state,
          [key]: value
        }
        return newState
      })
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
        ...tableFilter?.role !== 'all' ? { 'roles.name': { $in: [tableFilter.role] } } : {},
        ...tableFilter?.status !== 'all' ? { status: { $eq: tableFilter.status } } : {},
        ...tableFilter?.isTrashed ? { deletedAt: { $notnull: true } } : {},
      },
      relations: ['roles'],
    };
    userService.getMany(filter).then((data) => {
      setUsers(data?.items || []);
      setTotal(data?.total || 0);
    });
  }, [tableFilter?.isTrashed, tableFilter?.role, tableFilter?.status]);




  useEffect(() => {
    datatableRef?.current?.refresh();
  }, [tableFilter])


  const columns: DataTableColumn<IUser>[] = [
    {
      name: 'firstName',
      label: 'User Name',
      isSearchable: true,
      isSortable: true,
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* <MyAvatar user={row} /> */}
          <Typography variant="body2" noWrap>
            {row?.name}
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
    // {
    //   name: 'phone',
    //   label: 'Phone Number',
    //   isSearchable: false,
    //   isSortable: true,
    //   render: (row) => toDisplayPhone(row?.phone),
    // },
    {
      name: 'roles.name',
      label: 'Roles',
      isSearchable: true,
      isSortable: true,
      render: (row) => (row?.roles)?.map((role) => role.name).join(', '),
    },
    // {
    //   name: 'status',
    //   label: 'Status',
    //   isSearchable: true,
    //   isSortable: true,
    //   render: (row) => (
    //     <Label
    //       onClick={handleUpdateStatus(row)}
    //       variant='soft'
    //       color={row?.status === 'active' ? 'success' : 'error'}
    //     >
    //       {startCase(row?.status)}
    //     </Label>
    //   ),
    // },
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
      render: (row:any) => (
        <TableActionMenu
          row={row}
          actions={row?.deletedAt ? [{
            onClick: () => handleRestoreDelete(row),
            icon: <Icon icon="rotate-left" />,
            title: 'Restore'
          }] : []}
          // {...!row?.deletedAt ? { onView: () => handleViewUser(row), onEdit: () => handleOpenAddEditUser(row) } : {}}
          // {...!row?.isSuperAdmin ? { onDelete: () => handleDeleteUser(row) } : {}}
        />
      ),
    },
  ];


  return (
    // <Page title="Users">
    <Container maxWidth={false}>
      <DataTable
        data={users}
        columns={columns}
        ref={datatableRef}
        totalRow={total}
        selectable
        defaultOrder='desc'
        defaultOrderBy='createdAt'
        onChange={handleDataTableChange}
        onRowClick={handleRowClick}
        extraFilter={() => (
          <>
            <FormControlLabel
              onChange={(e, checked) => handleOnChangeTableFilter(checked, 'isTrashed')}
              control={
                <Switch
                  value={tableFilter?.isTrashed}
                />
              }
              label="Trashed"
            />
            <TextField
              select
              size="small"
              label="Status"
              value={tableFilter?.status}
              onChange={({ target }) => handleOnChangeTableFilter(target?.value, 'status')}
              sx={{ minWidth: 132 }}
            >
              <MenuItem value={"all"}>All Status</MenuItem>
              {Object.values(UserStatusEnum)?.map((status) => (
                <MenuItem key={status} value={status}>{startCase(status)}</MenuItem>
              ))}
            </TextField>
          </>
        )}
      />

      {/* {selectedUser && <AddEditUserDialog onClose={handleCloseAddEditUser} values={selectedUser} />} */}
    </Container>
    // </Page>
  );
}


