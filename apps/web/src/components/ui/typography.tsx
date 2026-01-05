"use client";

import React from "react";
import { cn } from "@web/utils/cn";
import { tv, type VariantProps } from "tailwind-variants";

type MuiTypographyVariant =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline"
    | "inherit";

type MuiTypographyColor =
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "grey"
    | "text-primary"
    | "text-secondary";

type SxProps = React.CSSProperties & {
    mt?: number | string;
    mb?: number | string;
    ml?: number | string;
    mr?: number | string;
    mx?: number | string;
    my?: number | string;
};

const typographyVariants = tv({
    base: ["m-0 font-sans"],
    variants: {
        variant: {
            h1: "text-[30px] md:text-[48px] lg:text-[48px] font-bold leading-[1.2]",
            h2: "text-[24px] md:text-[30px] lg:text-[30px] font-semibold leading-tight",
            h3: "text-[20px] md:text-[22px] lg:text-[22px] font-semibold leading-[1.3]",
            h4: "text-[16px] md:text-[20px] lg:text-[20px]  font-medium leading-[1.35]",
            h5: "text-[14px] md:text-[18px] lg:text-[18px]  font-medium leading-[1.4]",
            h6: "text-[13px] md:text-[16px] lg:text-[16px]  font-medium leading-[1.45]",
            subtitle1: "text-[18px] md:text-[20px] font-medium leading-normal",
            subtitle2: "text-[16px] md:text-[18px] font-medium leading-normal",
            body1: "text-[16px] md:text-[18px] font-normal leading-normal",
            body2: "text-[14px] md:text-[16px] font-normal leading-normal",
            caption: "text-[12px] font-normal leading-[1.4]",
            button: "text-[14px] font-medium leading-[1.75] uppercase",
            overline: "text-[12px] font-medium leading-[1.4] uppercase tracking-widest",
            inherit: "text-inherit font-inherit",
        },
        color: {
            inherit: "text-inherit",
            primary: "text-primary",
            secondary: "text-secondary",
            "text-primary": "text-text-primary",
            "text-secondary": "text-text-secondary",
            success: "text-success",
            error: "text-error",
            warning: "text-warning",
            info: "text-info",
            grey: "text-grey",
        },
        align: {
            inherit: "",
            left: "text-left",
            center: "text-center",
            right: "text-right",
            justify: "text-justify",
        },
        gutterBottom: {
            true: "mb-4",
        },
        noWrap: {
            true: "truncate",
        },
        paragraph: {
            true: "mb-4",
        },
    },
    defaultVariants: {
        variant: "body1",
        color: "inherit",
        align: "inherit",
    },
});

// Convert `sx` shorthand spacing props to real CSS
const sxToStyle = (sx?: SxProps): React.CSSProperties | undefined => {
    if (!sx) return undefined;

    const { mt, mb, ml, mr, mx, my, ...rest } = sx;
    const style: React.CSSProperties = { ...rest };

    if (mt !== undefined) style.marginTop = mt;
    if (mb !== undefined) style.marginBottom = mb;
    if (ml !== undefined) style.marginLeft = ml;
    if (mr !== undefined) style.marginRight = mr;
    if (mx !== undefined) {
        style.marginLeft = mx;
        style.marginRight = mx;
    }
    if (my !== undefined) {
        style.marginTop = my;
        style.marginBottom = my;
    }

    return style;
};

export interface TypographyProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
    component?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    sx?: SxProps;
}

export const Typography = ({
    variant = "body1",
    component,
    color,
    align,
    gutterBottom,
    noWrap,
    paragraph,
    sx,
    children,
    className,
    ...props
}: TypographyProps) => {
    const getDefaultComponent = (): React.ElementType => {
        if (component) return component;
        if (paragraph) return "p";
        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(variant)) return variant as React.ElementType;
        return "p";
    };

    const Element = getDefaultComponent();

    const classes = cn(
        typographyVariants({
            variant: variant as MuiTypographyVariant,
            color: color as MuiTypographyColor,
            align,
            gutterBottom,
            noWrap,
            paragraph,
        }),
        className
    );

    const style = sxToStyle(sx);

    return (
        <Element
            className={classes}
            style={style}
            suppressHydrationWarning
            {...props}
        >
            {children}
        </Element>
    );
};
