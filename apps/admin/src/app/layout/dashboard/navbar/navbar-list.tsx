import { useAccess } from '@admin/app/contexts';
import { Collapse, Popover } from '@mui/material';
import { flattenDeep } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { NavbarConfigProps, NavigationItem } from './navbar-group';
import NavbarItem from './navbar-item';


export function getPathsWithChild(data?: NavigationItem) {
    if (data) {
        if (data?.children) {
            return flattenDeep(data.children.map((item) => getPathsWithChild(item)));
        }
        return [...(data?.activePaths || []), data.path];
    }
    return [];
}

export function useActiveLink(
    data?: NavigationItem,
    isMatchFull?: boolean,
): boolean {
    const { pathname } = useLocation();
    let isInStaticPaths;
    const activePaths = getPathsWithChild(data);

    if (isMatchFull) {
        isInStaticPaths = activePaths?.some(
            (staticPath) => pathname === staticPath,
        );
    } else {
        isInStaticPaths = activePaths?.some((staticPath) => pathname?.includes(staticPath));
    }

    return isInStaticPaths ?? false;
}


interface NavbarListRootProps {
    data: NavigationItem;
    depth: number;
    hasChild: boolean;
    config?: NavbarConfigProps;
    isMini?: boolean;
    onCloseNav?: () => void

}

export default function NavbarList({
    data,
    depth,
    hasChild,
    config,
    isMini,
    onCloseNav,
}: NavbarListRootProps) {
    const { pathname } = useLocation();
    const navRef = useRef(null);
    const active = useActiveLink(data, !!config?.fullPatchMatch);
    const externalLink = data.path.includes('http');
    const [open, setOpen] = useState(active);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { hasAnyPermission } = useAccess();

    const handleToggle = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setPopoverOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setPopoverOpen(true);
    }, []);

    useEffect(() => {
        if (!active) {
            handleClose();
        }
    }, [
        active,
        handleClose,
        pathname,
    ]);

    const filteredChildren = useMemo(() => {
        if (hasChild) {
            return data.children.filter((child) => hasAnyPermission(child.permissions));
        }
        return [];
    }, [
        data.children,
        hasChild,
        hasAnyPermission,
    ]);

    return (
        <>
            <NavbarItem
                ref={navRef}
                item={data}
                depth={depth}
                open={open}
                active={active}
                externalLink={externalLink}
                onClick={() => {
                    if (hasChild) {
                        handleToggle();
                    } else if (onCloseNav) {
                        onCloseNav();
                    }
                }}
                config={config}
                {...(isMini && {
                    onMouseEnter: handleOpen,
                    onMouseLeave: handleClose,
                    isMini: true,
                })}
            />

            {hasChild && !isMini ? (
                <Collapse
                    in={open}
                    sx={{
                        ml: 4,
                    }}
                >
                    <NavbarSubList
                        data={filteredChildren}
                        depth={depth}
                        config={config}
                        onCloseNav={onCloseNav}
                    />
                </Collapse>
            ) : null}
            {hasChild && isMini ? (
                <Popover
                    open={popoverOpen}
                    anchorEl={navRef?.current}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    slotProps={{
                        paper: {
                            onMouseEnter: handleOpen,
                            onMouseLeave: handleClose,
                            sx: {
                                mt: 0.5,
                                pl: 1.5,
                                width: 160,
                                ...(popoverOpen && {
                                    pointerEvents: 'auto',
                                }),
                            },
                        },
                    }}
                    sx={{
                        pointerEvents: 'none',
                    }}
                >
                    <NavbarSubList
                        data={filteredChildren}
                        depth={depth}
                        config={config}
                    />
                </Popover>
            ) : null}
        </>
    );
}

type NavbarListSubProps = {
    data?: NavigationItem[];
    depth: number;
    config?: NavbarConfigProps;
    onCloseNav?: () => void
};

function NavbarSubList({ data, depth, config, onCloseNav }: NavbarListSubProps) {
    return (
        data?.map((list) => (
            <NavbarList
                key={list.title + list.path}
                data={list}
                depth={depth + 1}
                hasChild={!!list.children}
                onCloseNav={onCloseNav}
                config={{
                    fullPatchMatch: true,
                    ...config,
                    ...(list.config || {}),
                }}
            />
        ))
    );
}
