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
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';
import { RequirePermission } from '@ackplus/nest-auth-react';


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

    const crudActions: TableAction[] = useMemo(() => {
        return [
            ...(actions || []),
            ...(showView && canView && onView ?
                [
                    {
                        icon: <Icon icon={IconEnum.Eye} />,
                        title: 'View',
                        onClick: onView,
                    },
                ] :
                []),
            ...(showEdit && canEdit && onEdit ?
                [
                    {
                        icon: <Icon icon={IconEnum.Pencil} />,
                        title: 'Edit',
                        onClick: onEdit,
                    },
                ] :
                []),
            ...(onDelete && canDelete ?
                [
                    {
                        icon: <Icon icon={IconEnum.Trash} />,
                        title: 'Delete',
                        onClick: onDelete,
                    },
                ] :
                []),
            ...(onRestore && canRestore ?
                [
                    {
                        icon: <Icon icon={IconEnum.RotateCcw} />,
                        title: 'Restore',
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(onDeleteForever && canDeleteForever ?
                [
                    {
                        icon: <Icon icon={IconEnum.Trash2} />,
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
        canEdit,
        canRestore,
        canView,
        onDelete,
        onDeleteForever,
        onEdit,
        onRestore,
        onView,
        showEdit,
        showView,
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
                    {crudActions.map((action, _index) => (
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
                                    primaryTypographyProps={{ variant: 'body2' }}
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
