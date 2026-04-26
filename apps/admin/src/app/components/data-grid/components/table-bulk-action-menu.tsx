import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Button,
} from '@mui/material';
import { useMemo } from 'react';

import { TableAction } from './table-action-menu';
import { Icon } from '../../icons/icon';
import { IconEnum } from '../../icons/icons';
import { MenuDropdown } from '../../menu-dropdown/menu-drop-down';
import { useHasPermission } from '@ackplus/nest-auth-react';
import { PermissionsEnum } from '@libs/types';


type TableBulkActionMenuProps = {
    onDelete?: (row?: any[]) => void;
    onDeleteForever?: (row?: any[]) => void;
    onRestore?: (row?: any[]) => void;
    onEdit?: (row?: any[]) => void;
    onView?: (row?: any[]) => void;
    actions?: TableAction[];
    children?: any;
    permissionsKeys?: {
        delete?: PermissionsEnum;
        deleteForever?: PermissionsEnum;
        restore?: PermissionsEnum;
        edit?: PermissionsEnum;
        view?: PermissionsEnum;
    };
};

export function TableBulkActionMenu({

    children,
    permissionsKeys,
    onView,
    onEdit,
    onDelete,
    onDeleteForever,
    onRestore,
    actions,
}: TableBulkActionMenuProps) {

    const canDelete = permissionsKeys?.delete
        ? useHasPermission(permissionsKeys.delete)
        : true;
    const canDeleteForever = permissionsKeys?.deleteForever
        ? useHasPermission(permissionsKeys.deleteForever)
        : true;
    const canRestore = permissionsKeys?.restore
        ? useHasPermission(permissionsKeys.restore)
        : true;
    const canEdit = permissionsKeys?.edit
        ? useHasPermission(permissionsKeys.edit)
        : true;
    const canView = permissionsKeys?.view
        ? useHasPermission(permissionsKeys.view)
        : true;

    const crudActions: TableAction[] = useMemo(() => {
        return [
            ...(actions || []),
            ...(canView && onView ?
                [
                    {
                        icon: <Icon icon={IconEnum.Eye} />,
                        title: 'View',
                        onClick: onView,
                    },
                ] :
                []),
            ...(canEdit && onEdit ?
                [
                    {
                        icon: <Icon icon={IconEnum.Pencil} />,
                        title: 'Edit',
                        onClick: onEdit,
                    },
                ] :
                []),
            ...(canDelete && onDelete ?
                [
                    {
                        icon: <Icon icon={IconEnum.Trash} />,
                        title: 'Delete',
                        onClick: onDelete,
                    },
                ] :
                []),
            ...(canRestore && onRestore ?
                [
                    {
                        icon: <Icon icon={IconEnum.RotateCcw} />,
                        title: 'Restore',
                        onClick: onRestore,
                    },
                ] :
                []),
            ...(canDeleteForever && onDeleteForever ?
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
    ]);

    if (crudActions.length <= 2) {
        return (
            <Stack
                spacing={0.5}
                direction="row"
                alignItems="center"
            >
                {crudActions.map((action) => (
                    <Tooltip
                        title={action?.title}
                        key={action?.title}
                    >
                        <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                if (action.onClick) {
                                    action.onClick(event);
                                }
                            }}
                            sx={{
                                whiteSpace: 'nowrap',
                            }}
                            startIcon={action?.icon}
                        >
                            {action?.title}
                        </Button>
                    </Tooltip>
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
            {({ handleClose }: { handleClose: () => void }) => (
                <>
                    {crudActions.map((action, _index) => (
                        <MenuItem
                            key={action?.title}
                            onClick={(event) => {
                                event.stopPropagation();
                                if (action.onClick) {
                                    action.onClick(event);
                                }
                                handleClose();
                            }}
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
