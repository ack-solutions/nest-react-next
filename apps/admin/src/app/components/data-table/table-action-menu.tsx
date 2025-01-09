import { Icon, MenuDropdown, useAccess } from '@libs/react-core';
import {
    VisibilityOutlined as VisibilityOutlinedIcon,
    DeleteOutlined as DeleteOutlinedIcon,
    EditOutlined as EditOutlinedIcon,
    RestoreOutlined as RestoreOutlinedIcon,
    DeleteForeverOutlined as DeleteForeverOutlinedIcon,
} from '@mui/icons-material';
import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
} from '@mui/material';
import { useMemo } from 'react';


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
    onRestore?: (row?: any) => void;
    onDeleteForever?: (row?: any) => void;
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
    onRestore,
    onDeleteForever,
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
                    icon: <VisibilityOutlinedIcon />,
                    title: 'Preview',
                    permission: `show-${crudPermissionKey}`,
                    onClick: onView,
                }]
                : [],
            ...onEdit
                ? [{
                    icon: <EditOutlinedIcon />,
                    title: 'Edit',
                    permission: `update-${crudPermissionKey}`,
                    onClick: onEdit,
                }]
                : [],
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
                    title: 'Delete Forever',
                    permission: `trash-delete-${crudPermissionKey}`,
                    onClick: onDeleteForever,
                }]
                : [],
        ].filter((item) => item);
    }, [actions, onView, crudPermissionKey, onEdit, onDelete, onRestore, onDeleteForever, hasAnyPermission]);

    if (crudActions.length <= 2) {
        return (
            <Stack
                spacing={0.5}
                direction="row"
            >
                {crudActions.map((action) => (
                    <Tooltip
                        key={`${action?.title}-${row?.id}`}
                        title={action?.title}
                    >
                        <IconButton
                            size="small"
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
                    <Icon
                        icon="more-vertical-outline"
                        size="medium"
                    />
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
