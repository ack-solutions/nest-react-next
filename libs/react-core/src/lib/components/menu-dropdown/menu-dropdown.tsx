import { Button, Menu, MenuProps, Popover } from '@mui/material';
import { cloneElement, ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';


type ChildrenEvent = {
    handleClose: () => void;
}

type AnchorEvent = {
    isOpen: boolean;
}

export interface MenuDropdownProps extends Omit<MenuProps, 'children' | 'open'> {
    children?: ((event: ChildrenEvent) => ReactNode) | ReactNode | any;
    anchor?: ((event: AnchorEvent) => ReactElement<any>) | ReactElement<any>,
    label?: ReactNode,
    component?: typeof Popover | typeof Menu
}

export function MenuDropdown({
    children,
    anchor,
    label,
    component,
    sx,
    ...props
}: MenuDropdownProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
        },
        [],
    );
    const handleClose = useCallback(
        (event:any) => {
            event?.preventDefault();
            event?.stopPropagation();
            setAnchorEl(null);
        },
        [],
    );
    const anchorNode = useMemo(() => {
        if (anchor) {
            let node = anchor;
            if (typeof anchor === 'function') {
                node = anchor({ isOpen: isOpen });
            }
            return cloneElement(node as ReactElement<any>, {
                onClick: handleClick,
            });
        }
        return (
                <Button
                    onClick={handleClick}
                >
                    {label}
                </Button>
        );
    }, [
        anchor,
        handleClick,
        isOpen,
        label,
    ]);

    const DropDownComponent = component || Popover;

    return (
        <>
            {anchorNode}
            <DropDownComponent
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                {...props}
            >
                {typeof children === 'function' ? children({ handleClose }) : children}
            </DropDownComponent>
        </>
    );
}
