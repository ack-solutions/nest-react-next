import { Collapse, Popover } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import NavbarItem from "./navbar-item";
import { NavbarConfigProps, NavigationItem } from "../../../types/navigation";


export function useActiveLinkByStaticPaths(staticPaths?: string[], isMatchFull?: boolean): boolean {
    const { pathname } = useLocation();
    let isInStaticPaths
    if (isMatchFull) {
        isInStaticPaths = staticPaths?.some((staticPath) => pathname === staticPath);
    }
    else {
        isInStaticPaths = staticPaths?.some((staticPath) => pathname?.includes(staticPath));
    }

    return isInStaticPaths ?? false;
}

export function useActiveLink(path: string, deep = true): boolean {
    const { pathname } = useLocation();

    const checkPath = path.startsWith('#');

    const currentPath = path === '/' ? '/' : `${path}/`;

    const normalActive = !checkPath && pathname === currentPath;

    const deepActive = !checkPath && pathname?.includes(currentPath);

    return deep && deepActive ? deepActive : normalActive;
}

interface NavbarListRootProps {
    data: NavigationItem;
    depth: number;
    hasChild: boolean;
    config?: NavbarConfigProps;
    isMini?: boolean
}

;


export default function NavbarList({ data, depth, hasChild, config, isMini }: NavbarListRootProps) {
    const { pathname } = useLocation();
    const navRef = useRef(null);
    const active = useActiveLinkByStaticPaths(data.staticPaths ? data.staticPaths : [], !!config?.fullPatchMatch);
    const externalLink = data.path.includes('http');
    const [open, setOpen] = useState(active);

    const handleToggle = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    useEffect(() => {
        if (!active) {
            handleClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            <NavbarItem
                ref={navRef}
                item={data}
                depth={depth}
                open={open}
                active={active}
                externalLink={externalLink}
                onClick={handleToggle}
                config={config}
                {...isMini && {
                    onMouseEnter: handleOpen,
                    onMouseLeave: handleClose,
                    isMini: true
                }}
            />

            {(hasChild && !isMini) && (
                <Collapse
                    in={open}
                    unmountOnExit
                >
                    <NavbarSubList
                        data={data.children}
                        depth={depth}
                        config={config}
                    />
                </Collapse>
            )}
            {(hasChild && isMini) && (
                <Popover
                    open={open}
                    anchorEl={navRef?.current}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left'
                    }}
                    slotProps={{
                        paper: {
                            onMouseEnter: handleOpen,
                            onMouseLeave: handleClose,
                            sx: {
                                mt: 0.5,
                                width: 160,
                                ...(open && {
                                    pointerEvents: 'auto'
                                })
                            }
                        }
                    }}
                    sx={{
                        pointerEvents: 'none'
                    }}
                >
                    <NavbarSubList
                        data={data.children}
                        depth={depth}
                        config={config}
                    />
                </Popover>
            )}
        </>
    );
}

type NavbarListSubProps = {
    data?: NavigationItem[];
    depth: number;
    config?: NavbarConfigProps;
};

function NavbarSubList({ data, depth, config }: NavbarListSubProps) {
    return (

        data?.map((list) => (
            <NavbarList
                key={list.title + list.path}
                data={list}
                depth={depth + 1}
                hasChild={!!list.children}
                config={{
                    ...config,
                    ...(list.config || {})
                }}
            />
        ))
    );
}
