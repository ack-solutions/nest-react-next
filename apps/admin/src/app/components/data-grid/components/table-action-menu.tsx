import {
    IconButton,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';

import { Icon } from '../../icons/icon';
import { IconEnum } from '../../icons/icons';
import { MenuDropdown } from '../../menu-dropdown/menu-drop-down';
import { useHasPermission } from '@ackplus/nest-auth-react';
import { PermissionsEnum } from '@libs/types';


export interface TableAction {
    icon?: ReactNode;
    title: string;
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
    children?: any;
    permissionsKeys?: {
        delete?: PermissionsEnum;
        deleteForever?: PermissionsEnum;
        restore?: PermissionsEnum;
        edit?: PermissionsEnum;
        view?: PermissionsEnum;
    };
};

export function TableActionMenu({
    children,
    onDelete,
    onEdit,
    onView,
    onRestore,
    onDeleteForever,
    permissionsKeys,
    actions,
}: TableActionMenuProps) {

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
                        title: 'Preview',
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
                        title: 'Delete Forever',
                        onClick: onDeleteForever,
                    },
                ] :
                []),
        ].filter((item) => item);
    }, [
        actions,
        onView,
        children,
        onEdit,
        onDelete,
        onRestore,
        onDeleteForever,
    ]);

    if (crudActions.length <= 2 && !children) {
        return (
            <Stack
                spacing={0.5}
                direction="row"
            >
                {crudActions.map((action,) => (
                    <Tooltip
                        title={action?.title}
                        key={action?.title}
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
                    <Icon icon={IconEnum.EllipsisVertical} />
                </IconButton>
            )}
        >
            {({ handleClose }: { handleClose: () => void }) => (
                <>
                    {crudActions.map((action) => (
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
