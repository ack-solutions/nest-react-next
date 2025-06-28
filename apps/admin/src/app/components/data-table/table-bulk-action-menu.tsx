import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
} from '@mui/material';
import { useMemo } from 'react';

import { TableAction } from './table-action-menu';
import { useAccess } from '../../contexts';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';


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

    const crudActions: TableAction[] = useMemo(() => {
        const otherActions = (actions || [])?.filter(
            (action) => !action.permission || hasAnyPermission(action.permission),
        );

        return [
            ...otherActions,
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
                        icon: <Icon icon={IconEnum.CLOCK_ANTI_CLOCKWISE} />,
                        title: 'Restore',
                        permission: `update-${crudPermissionKey}`,
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(onDeleteForever ?
                [
                    {
                        icon: <Icon icon={IconEnum.TRASH_X} />,
                        title: 'Permanent delete',
                        permission: `delete-${crudPermissionKey}`,
                        onClick: onDeleteForever,
                    },
                ] :
                []),
        ].filter((item) => item.permission ? hasAnyPermission(item.permission) : true);
    }, [
        actions,
        crudPermissionKey,
        hasAnyPermission,
        onDelete,
        onDeleteForever,
        onRestore,
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
                    {crudActions.map((action, _index) => (
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
