"use client";

import React, { Children, cloneElement } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@web/utils/cn";

const stackVariants = tv({
    base: "flex",
    variants: {
        direction: {
            row: "flex-row",
            "row-reverse": "flex-row-reverse",
            column: "flex-col",
            "column-reverse": "flex-col-reverse",
        },
        wrap: {
            wrap: "flex-wrap",
            nowrap: "flex-nowrap",
            "wrap-reverse": "flex-wrap-reverse",
        },
        spacing: {
            0: "gap-0",
            1: "gap-1",
            2: "gap-2",
            3: "gap-3",
            4: "gap-4",
            5: "gap-5",
            6: "gap-6",
            7: "gap-7",
            8: "gap-8",
            9: "gap-9",
            10: "gap-10",
        },
        alignItems: {
            "flex-start": "items-start",
            center: "items-center",
            "flex-end": "items-end",
            stretch: "items-stretch",
            baseline: "items-baseline",
        },
        justifyContent: {
            "flex-start": "justify-start",
            center: "justify-center",
            "flex-end": "justify-end",
            "space-between": "justify-between",
            "space-around": "justify-around",
            "space-evenly": "justify-evenly",
        },
    },
    defaultVariants: {
        direction: "column",
    },
});

export interface StackProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof stackVariants> {
    children: React.ReactNode;
    divider?: React.ReactNode;
    className?: string;
    sx?: React.CSSProperties;
}

export const Stack: React.FC<StackProps> = ({
    children,
    divider,
    className,
    sx,
    ...props
}) => {
    const childrenArray = Children.toArray(children);

    const content = divider
        ? childrenArray.flatMap((child, index) =>
            index < childrenArray.length - 1
                ? [child, cloneElement(divider as React.ReactElement<any>, { key: `divider-${index}` })]
                : [child]
        )
        : childrenArray;

    return (
        <div
            className={cn(stackVariants(props), className)}
            style={sx}
        >
            {content}
        </div>
    );
};
