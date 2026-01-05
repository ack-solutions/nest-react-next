import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

type Scale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// 8px scale → Tailwind spacing scale:
// 1 => 8px  => 2
// 2 => 16px => 4
// ...
// 10 => 80px => 20
type SpacingValue = Scale;
type MarginValue = SpacingValue | 'auto';

type BorderRadiusValue = 0 | 1 | 2 | 3 | 4 | 'round' | 'circle';
type ElevationValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const boxVariants = tv({
    base: '',
    variants: {
        display: {
            block: 'block',
            'inline-block': 'inline-block',
            flex: 'flex',
            'inline-flex': 'inline-flex',
            grid: 'grid',
            'inline-grid': 'inline-grid',
            none: 'hidden',
        },
        flexDirection: {
            row: 'flex-row',
            'row-reverse': 'flex-row-reverse',
            column: 'flex-col',
            'column-reverse': 'flex-col-reverse',
        },
        alignItems: {
            'flex-start': 'items-start',
            center: 'items-center',
            'flex-end': 'items-end',
            stretch: 'items-stretch',
            baseline: 'items-baseline',
        },
        justifyContent: {
            'flex-start': 'justify-start',
            center: 'justify-center',
            'flex-end': 'justify-end',
            'space-between': 'justify-between',
            'space-around': 'justify-around',
            'space-evenly': 'justify-evenly',
        },
        flexWrap: {
            nowrap: 'flex-nowrap',
            wrap: 'flex-wrap',
            'wrap-reverse': 'flex-wrap-reverse',
        },
        overflow: {
            auto: 'overflow-auto',
            hidden: 'overflow-hidden',
            scroll: 'overflow-scroll',
            visible: 'overflow-visible',
        },
        overflowX: {
            auto: 'overflow-x-auto',
            hidden: 'overflow-x-hidden',
            scroll: 'overflow-x-scroll',
            visible: 'overflow-x-visible',
        },
        overflowY: {
            auto: 'overflow-y-auto',
            hidden: 'overflow-y-hidden',
            scroll: 'overflow-y-scroll',
            visible: 'overflow-y-visible',
        },
        position: {
            static: 'static',
            relative: 'relative',
            absolute: 'absolute',
            fixed: 'fixed',
            sticky: 'sticky',
        },
        textAlign: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
        borderRadius: {
            0: 'rounded-none',
            1: 'rounded', // 4px
            2: 'rounded-lg', // 8px
            3: 'rounded-xl', // 12px
            4: 'rounded-2xl', // 16px
            round: 'rounded-full',
            circle: 'rounded-full',
        },
        elevation: {
            0: 'shadow-none',
            1: 'shadow-sm',
            2: 'shadow',
            3: 'shadow-md',
            4: 'shadow-lg',
            5: 'shadow-xl',
            6: 'shadow-2xl',
            7: 'shadow-2xl',
            8: 'shadow-2xl',
        },
    },
});

type BoxVariantProps = VariantProps<typeof boxVariants>;

type ElementType = React.ElementType;

type PropsOf<T extends ElementType> = React.ComponentPropsWithoutRef<T>;
type PolymorphicRef<T extends ElementType> = React.ComponentPropsWithRef<T>['ref'];


const isCssColorValue = (v: string) =>
    v.startsWith('#') ||
    v.startsWith('rgb(') ||
    v.startsWith('rgba(') ||
    v.startsWith('hsl(') ||
    v.startsWith('hsla(') ||
    v.startsWith('var(');

const spaceToTw = (v: SpacingValue) => String(v * 2); // 0..20
const marginToTw = (v: MarginValue) => (v === 'auto' ? 'auto' : String(v * 2));

const gapClass = (v?: SpacingValue) => (v === undefined ? null : `gap-${spaceToTw(v)}`);
const rowGapClass = (v?: SpacingValue) => (v === undefined ? null : `gap-y-${spaceToTw(v)}`);
const colGapClass = (v?: SpacingValue) => (v === undefined ? null : `gap-x-${spaceToTw(v)}`);

function spacingClasses({
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
}: {
    p?: SpacingValue;
    px?: SpacingValue;
    py?: SpacingValue;
    pt?: SpacingValue;
    pr?: SpacingValue;
    pb?: SpacingValue;
    pl?: SpacingValue;
    m?: MarginValue;
    mx?: MarginValue;
    my?: MarginValue;
    mt?: MarginValue;
    mr?: MarginValue;
    mb?: MarginValue;
    ml?: MarginValue;
}) {
    const cls: Array<string> = [];

    // Padding
    if (p !== undefined) cls.push(`p-${spaceToTw(p)}`);
    if (px !== undefined) cls.push(`px-${spaceToTw(px)}`);
    if (py !== undefined) cls.push(`py-${spaceToTw(py)}`);
    if (pt !== undefined) cls.push(`pt-${spaceToTw(pt)}`);
    if (pr !== undefined) cls.push(`pr-${spaceToTw(pr)}`);
    if (pb !== undefined) cls.push(`pb-${spaceToTw(pb)}`);
    if (pl !== undefined) cls.push(`pl-${spaceToTw(pl)}`);

    // Margin
    if (m !== undefined) cls.push(`m-${marginToTw(m)}`);
    if (mx !== undefined) cls.push(`mx-${marginToTw(mx)}`);
    if (my !== undefined) cls.push(`my-${marginToTw(my)}`);
    if (mt !== undefined) cls.push(`mt-${marginToTw(mt)}`);
    if (mr !== undefined) cls.push(`mr-${marginToTw(mr)}`);
    if (mb !== undefined) cls.push(`mb-${marginToTw(mb)}`);
    if (ml !== undefined) cls.push(`ml-${marginToTw(ml)}`);

    return cls;
}

const borderWidthClass = (w?: number) => {
    if (w === undefined) return null;
    if (w === 0) return 'border-0';
    if (w === 1) return 'border';
    if (w === 2) return 'border-2';
    if (w === 4) return 'border-4';
    if (w === 8) return 'border-8';
    return `border-[${w}px]`;
};

const borderSideWidthClass = (side: 't' | 'r' | 'b' | 'l', w?: number) => {
    if (w === undefined) return null;
    if (w === 0) return `border-${side}-0`;
    if (w === 1) return `border-${side}`;
    if (w === 2) return `border-${side}-2`;
    if (w === 4) return `border-${side}-4`;
    if (w === 8) return `border-${side}-8`;
    return `border-${side}-[${w}px]`;
};

type BoxOwnProps = {
    children?: React.ReactNode;
    component?: React.ElementType;

    // Flex/Grid helpers
    gap?: SpacingValue;
    rowGap?: SpacingValue;
    columnGap?: SpacingValue;

    // Spacing
    p?: SpacingValue;
    px?: SpacingValue;
    py?: SpacingValue;
    pt?: SpacingValue;
    pb?: SpacingValue;
    pl?: SpacingValue;
    pr?: SpacingValue;

    m?: MarginValue;
    mx?: MarginValue;
    my?: MarginValue;
    mt?: MarginValue;
    mb?: MarginValue;
    ml?: MarginValue;
    mr?: MarginValue;

    // Dimensions (kept as inline style, because Tailwind is token-based)
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    minHeight?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;

    // Colors
    bgcolor?: string; // "primary" -> bg-primary, "bg-zinc-900" -> class, "#fff" -> inline style
    borderColor?: string; // "border-border" -> class, "border-zinc-200" -> class, "#eee" -> inline style

    // Border widths
    border?: number;
    borderTop?: number;
    borderRight?: number;
    borderBottom?: number;
    borderLeft?: number;

    className?: string;
    style?: React.CSSProperties;
};


export type BoxProps<T extends ElementType = 'div'> = BoxOwnProps & BoxVariantProps & { component?: T; } &
    Omit<PropsOf<T>, keyof BoxOwnProps | keyof BoxVariantProps | 'component'>;

type BoxComponent = <T extends ElementType = 'div'>(
    props: BoxProps<T> & { ref?: PolymorphicRef<T> }
) => React.ReactElement | null;


export const Box = React.forwardRef(function BoxInner(
    props: BoxProps,
    ref: React.ForwardedRef<any>,
) {
    const {
        component,
        className,
        style,
        display,
        children,
        ...rest
    } = props;

    const Component = (component ?? 'div') as ElementType;

    return React.createElement(
        Component,
        {
            ref,
            className: cn(boxVariants({ display }), className),
            style,
            ...rest,
        },
        children,
    );
}) as BoxComponent;


export default Box;