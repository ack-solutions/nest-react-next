import { Collapse, List, ListSubheader, StackProps, styled } from '@mui/material';
import React, { ReactElement, useCallback, useState } from 'react';

import NavbarList from './navbar-list';


export interface Navigation {
    subheader?: string;
    items: NavigationItem[];
}

export interface NavigationItem {
    groupName?: string;
    id: string;
    title: string;
    path: string;
    icon?: ReactElement;
    info?: ReactElement;
    caption?: string;
    disabled?: boolean;
    roles?: string[];
    permissions?: string[];
    children?: NavigationItem[];
    order?: number;
    parentId?: string;
    activePaths?: string[];
    config?: NavbarConfigProps;
}

export interface NavbarConfigProps {
    hiddenLabel?: boolean;
    itemGap?: number;
    iconSize?: number;
    itemRadius?: number;
    itemPadding?: string;
    currentRole?: string;
    itemSubHeight?: number;
    itemRootHeight?: number;
    fullPatchMatch?: boolean;
}


export interface NavbarSectionProps extends StackProps {
    data: Navigation[];
    config?: NavbarConfigProps;
}


const StyledSubheader = styled(ListSubheader)<{ config?: NavbarConfigProps }>(
    ({ config, theme }) => ({
        ...theme.typography.overline,
        fontSize: 11,
        cursor: 'pointer',
        display: 'inline-flex',
        padding: config?.itemPadding,
        paddingTop: theme.spacing(2),
        marginBottom: config?.itemGap,
        paddingBottom: theme.spacing(1),
        color: theme.palette.text.disabled,
        transition: theme.transitions.create(['color'], {
            duration: theme.transitions.duration.shortest,
        }),
        '&:hover': {
            color: theme.palette.text.primary,
        },
    }),
);

interface NavGroupProps {
    subheader?: string;
    items: NavigationItem[];
    config?: NavbarConfigProps;
    initialStatus?: boolean;
    isMini?: boolean;
    onCloseNav?: () => void;
}

export function NavbarGroup({
    subheader,
    items,
    config,
    initialStatus,
    isMini,
    onCloseNav,
}: NavGroupProps) {
    const [open, setOpen] = useState(!initialStatus);

    const handleToggle = useCallback(() => {
        setOpen((state) => !state);
    }, []);

    if (isMini) {
        return items.map((list) => (
            <NavbarList
                key={list.id || list.title}
                data={list}
                depth={1}
                hasChild={!!list.children}
                config={config}
                isMini={isMini}
                onCloseNav={onCloseNav}
            />
        ));
    }

    return (
        <List
            disablePadding
            sx={{ px: 2 }}
        >
            {subheader ? (
                <>
                    <StyledSubheader
                        disableGutters
                        disableSticky
                        onClick={handleToggle}
                        config={config}
                    >
                        {subheader}
                    </StyledSubheader>

                    <Collapse in={open}>
                        {items.map((list) => (
                            <NavbarList
                                key={list.id || list.title}
                                data={list}
                                depth={1}
                                hasChild={!!list.children}
                                config={config}
                                onCloseNav={onCloseNav}
                            />
                        ))}
                    </Collapse>
                </>
            ) : (
                items.map((list) => (
                    <NavbarList
                        key={list.id || list.title}
                        data={list}
                        depth={1}
                        hasChild={!!list.children}
                        config={config}
                        onCloseNav={onCloseNav}
                    />
                ))
            )}
        </List>
    );
}

export default NavbarGroup;
