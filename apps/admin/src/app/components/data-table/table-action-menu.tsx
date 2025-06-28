import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';

import { useAccess } from '../../contexts';
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
    const { hasAnyPermission } = useAccess();

    const crudActions: TableAction[] = useMemo(() => {
        const otherActions = (actions || [])?.filter(
            (action) => !action.permission || hasAnyPermission(action.permission),
        );

        return [
            ...otherActions,
            ...(onView ?
                [
                    {
                        icon: <Icon icon={IconEnum.EYE} />,
                        title: 'Preview',
                        permission: `show-${crudPermissionKey}`,
                        onClick: onView,
                    },
                ] :
                []),
            ...(onEdit ?
                [
                    {
                        icon: <Icon icon={IconEnum.PENCIL_SIMPLE} />,
                        title: 'Edit',
                        permission: `update-${crudPermissionKey}`,
                        onClick: onEdit,
                    },
                ] :
                []),
            ...(onDelete ?
                [
                    {
                        icon: <Icon icon={IconEnum.TRASH} />,
                        title: 'Delete',
                        permission: `delete-${crudPermissionKey}`,
                        onClick: onDelete,
                    },
                ] :
                []),
            ...(onRestore ?
                [
                    {
                        icon: <Icon icon={IconEnum.CLOCK_REVERSE} />,
                        title: 'Restore',
                        permission: `restore-${crudPermissionKey}`,
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(onDeleteForever ?
                [
                    {
                        icon: <Icon icon={IconEnum.TRASH_X} />,
                        title: 'Delete Forever',
                        permission: `trash-delete-${crudPermissionKey}`,
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
        hasAnyPermission,
    ]);

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
                ))}
            </Stack>
        );
    }

    return (
        <MenuDropdown
            anchor={(
                <IconButton>
                    <Icon icon={IconEnum.DOTS_THREE_VERTICAL} />
                </IconButton>
            )}
        >
            {({ handleClose }) => (
                <>
                    {crudActions.map((action) => (
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
                    ))}
                    {children}
                </>
            )}
        </MenuDropdown>
    );
}
