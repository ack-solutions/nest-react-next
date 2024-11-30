import { useMemo } from 'react';
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from '@mui/material';
import { MenuDropdown } from '../menu-dropdown/menu-dropdown';
import { Icon, useAccess } from '@libs/react-core';

export interface TableAction {
  icon: any;
  title: string;
  permission?: string | string[];
  onClick?: (event?: any) => void;
}
type TableActionMenuProps = {
  onDelete?: (row?: any) => void;
  onEdit?: (row?: any) => void;
  onView?: (row?: any) => void;
  row?: any;
  actions?: TableAction[];
  crudPermissionKey?: string;
  children?: any;
};

export function TableActionMenu({
  crudPermissionKey,
  children,
  onDelete,
  onEdit,
  onView,
  row,
  actions,
}: TableActionMenuProps) {
  const { hasAnyPermission } = useAccess();

  const crudActions: TableAction[] = useMemo(() => {
    const otherActions = (actions || [])?.filter(
      (action) => !action.permission || hasAnyPermission(action.permission)
    );

    return [
      ...otherActions,
      ...onView
        ? [{
          icon: <Icon icon='eye' />,
          title: 'Preview',
          permission: `show-${crudPermissionKey}`,
          onClick: onView,
        }]
        : [],
      ...onEdit
        ? [{
          icon: <Icon icon='edit' />,
          title: 'Edit',
          permission: `update-${crudPermissionKey}`,
          onClick: onEdit,
        }]
        : [],
      ...onDelete
        ? [{
          icon: <Icon icon='trash' />,
          title: 'Delete',
          permission: `delete-${crudPermissionKey}`,
          onClick: onDelete,
        }]
        : [],
    ].filter((item) => item);
  }, [actions, onView, crudPermissionKey, onEdit, hasAnyPermission, onDelete]);

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
        <IconButton >
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
