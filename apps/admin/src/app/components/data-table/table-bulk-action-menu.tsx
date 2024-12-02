import { useMemo } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';
import { Icon, MenuDropdown, useAccess } from '@libs/react-core';
import {
  DeleteOutlined as DeleteOutlinedIcon,
  RestoreOutlined as RestoreOutlinedIcon,
  DeleteForeverOutlined as DeleteForeverOutlinedIcon,
} from '@mui/icons-material';

export interface TableAction {
  icon: any;
  title: string;
  permission?: string | string[];
  onClick?: (event?: any) => void;
}
type TableBulkActionMenuProps = {
  onDelete?: (row?: any[]) => void;
  onDeleteForever?: (row?: any[]) => void;
  onRestore?: (row?: any[]) => void;
  row?: any;
  actions?: TableAction[];
  crudPermissionKey?: string;
  children?: any;
};

export function TableBulkActionMenu({
  crudPermissionKey,
  children,
  onDelete,
  onDeleteForever,
  onRestore,
  row,
  actions,
}: TableBulkActionMenuProps) {
  const { hasAnyPermission } = useAccess();

  const crudActions: TableAction[] = useMemo(
    () => {
      const otherActions = (actions || [])?.filter(
        (action) => !action.permission || hasAnyPermission(action.permission)
      );

      return [
        ...otherActions,
        ...onDelete
          ? [{
            icon: <DeleteOutlinedIcon />,
            title: 'Delete',
            permission: `delete-${crudPermissionKey}`,
            onClick: onDelete,
          }]
          : [],
        ...onRestore
          ? [{
            icon: <RestoreOutlinedIcon />,
            title: 'Restore',
            permission: `restore-${crudPermissionKey}`,
            onClick: onRestore,
          }]
          : [],
        ...onDeleteForever
          ? [{
            icon: <DeleteForeverOutlinedIcon />,
            title: 'Permanent delete',
            permission: `trash-delete-${crudPermissionKey}`,
            onClick: onDeleteForever,
          }]
          : [],
      ].filter((item) => item);
    },
    [actions, crudPermissionKey, hasAnyPermission, onDelete]
  );

  if (crudActions.length <= 2) {
    return (
      <Stack spacing={1} direction="row">
        {crudActions.map((action) => (
          <Tooltip key={`${action?.title}-${row?.id}`} title={action?.title}>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                action.onClick && action.onClick(event);
              }}
            >
              {action?.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    );
  }

  return (
    <MenuDropdown
      anchor={
        <IconButton>
          <Icon icon="more-vertical-outline" size="medium" />
        </IconButton>
      }
    >
      {({ }) => (
        <>
          {crudActions.map((action, index) => (
            <MenuItem
              onClick={(event) => {
                event.stopPropagation();
                action.onClick && action.onClick(event);
              }}
              key={`${action?.title}-${row?.id}`}
            >
              {action?.icon && (
                <ListItemIcon sx={{ mr: 0 }}>{action?.icon}</ListItemIcon>
              )}
              <ListItemText
                primary={action?.title}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          ))}
          {children}
        </>
      )}
    </MenuDropdown>
  );
}
