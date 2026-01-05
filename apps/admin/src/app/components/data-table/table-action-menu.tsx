import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { RequirePermission } from '@ackplus/nest-auth-react';

import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';


export interface TableAction {
    icon?: ReactNode;
    title: string;
    permission?: string | string[];
    onClick?: (event?: any) => void;
}

export type TableActionMenuProps = {
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


    const crudActions: TableAction[] = useMemo(() => {
        // const otherActions = (actions || [])?.filter(
        //     (action) => !action.permission || hasAnyPermission(action.permission),
        // );

        return [
            ...(actions || []),
            ...(onView ?
                [
                    {
                        icon: <Icon icon={IconEnum.Eye} />,
                        title: 'Preview',
                        permission: crudPermissionKey ? `show-${crudPermissionKey}` : undefined,
                        onClick: onView,
                    },
                ] :
                []),
            ...(onEdit ?
                [
                    {
                        icon: <Icon icon={IconEnum.Pencil} />,
                        title: 'Edit',
                        permission: crudPermissionKey ? `update-${crudPermissionKey}` : undefined,
                        onClick: onEdit,
                    },
                ] :
                []),
            ...(onDelete ?
                [
                    {
                        icon: <Icon icon={IconEnum.Trash} />,
                        title: 'Delete',
                        permission: crudPermissionKey ? `delete-${crudPermissionKey}` : undefined,
                        onClick: onDelete,
                    },
                ] :
                []),
            ...(onRestore ?
                [
                    {
                        icon: <Icon icon={IconEnum.RotateCcw} />,
                        title: 'Restore',
                        permission: crudPermissionKey ? `restore-${crudPermissionKey}` : undefined,
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(onDeleteForever ?
                [
                    {
                        icon: <Icon icon={IconEnum.Trash2} />,
                        title: 'Delete Forever',
                        permission: crudPermissionKey ? `trash-delete-${crudPermissionKey}` : undefined,
                        onClick: onDeleteForever,
                    },
                ] :
                []),
        ].filter((item) => item);
    }, [
        actions,
        onView,
        crudPermissionKey,
        onEdit,
        onDelete,
        onRestore,
        onDeleteForever,
    ]);

    if (crudActions.length <= 2) {
        return (
            <Stack
                spacing={0.5}
                direction="row"
            >
                {crudActions.map((action) => (
                    <RequirePermission permission={action.permission!} key={`${action?.title}-${row?.id}`}>
                        <Tooltip
                            key={`${action?.title}-${row?.id}`}
                            title={action?.title}
                        >
                            <IconButton
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (action.onClick) {
                                        action.onClick(event);
                                    }
                                }}
                            >
                                {action?.icon}
                            </IconButton>
                        </Tooltip>
                    </RequirePermission>
                ))}
            </Stack>
        );
    }

    return (
        <MenuDropdown
            anchor={(
                <IconButton>
                    <Icon icon={IconEnum.EllipsisVertical} />
                </IconButton>
            )}
        >
            {({ handleClose }) => (
                <>
                    {crudActions.map((action) => (
                        <RequirePermission permission={action.permission!} key={`${action?.title}-${row?.id}`}>
                            <MenuItem
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (action.onClick) {
                                        action.onClick(event);
                                    }
                                    handleClose();
                                }}
                                key={`${action?.title}-${row?.id}`}
                            >
                                {action?.icon ? (
                                    <ListItemIcon sx={{ mr: 0 }}>
                                        {action?.icon}
                                    </ListItemIcon>
                                ) : null}
                                <ListItemText
                                    primary={action?.title}
                                    slotProps={{
                                        primary: {
                                            variant: 'body2',
                                        },
                                    }}
                                />
                            </MenuItem>
                        </RequirePermission>
                    ))}
                    {children}
                </>
            )}
        </MenuDropdown>
    );
}
