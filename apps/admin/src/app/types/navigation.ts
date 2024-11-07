import { StackProps } from "@mui/material";
import { ReactElement } from "react";

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
    staticPaths?: string[];
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
};

export interface NavbarSectionProps extends StackProps {
    data: Navigation[];
    config?: NavbarConfigProps;
};