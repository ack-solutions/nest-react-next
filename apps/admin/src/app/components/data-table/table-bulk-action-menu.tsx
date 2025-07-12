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
    onEdit?: (row?: any[]) => void;
    onView?: (row?: any[]) => void;
    row?: any;
    actions?: TableAction[];
    children?: any;
    showEdit?: boolean;
    showView?: boolean;
    canEdit?: boolean;
    canView?: boolean;
    canDelete?: boolean;
    canRestore?: boolean;
    canDeleteForever?: boolean;
};

export function TableBulkActionMenu({
    canView,
    canEdit,
    canDelete,
    canRestore,
    canDeleteForever,
    children,
    showView,
    onView,
    showEdit,
    onEdit,
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
            ...(showView && canView && onView ?
                [
                    {
                        icon: <Icon icon={IconEnum.EYE} />,
                        title: 'View',
                        onClick: onView,
                    },
                ] :
                []),
            ...(showEdit && canEdit && onEdit ?
                [
                    {
                        icon: <Icon icon={IconEnum.PENCIL_SIMPLE} />,
                        title: 'Edit',
                        onClick: onEdit,
                    },
                ] :
                []),
            ...(onDelete && canDelete ?
                [
                    {
                        icon: <Icon icon={IconEnum.TRASH} />,
                        title: 'Delete',
                        onClick: onDelete,
                    },
                ] :
                []),
            ...(onRestore && canRestore ?
                [
                    {
                        icon: <Icon icon={IconEnum.CLOCK_ANTI_CLOCKWISE} />,
                        title: 'Restore',
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(onDeleteForever && canDeleteForever ?
                [
                    {
                        icon: <Icon icon={IconEnum.TRASH_X} />,
                        title: 'Permanent delete',
                        onClick: onDeleteForever,
                    },
                ] :
                []),
        ].filter(Boolean);
    }, [
        actions,
        canDelete,
        canDeleteForever,
        canRestore,
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
