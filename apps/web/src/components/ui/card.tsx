import React from 'react';
import { cn } from '../../utils/cn';
import { tv, type VariantProps } from 'tailwind-variants';

const cardVariants = tv({
    base: [
        'rounded-2xl transition-all duration-200',
    ],
    variants: {
        variant: {
            default: 'bg-background border border-border-subtle shadow-sm hover:shadow-md',
            glass: 'bg-background/80 backdrop-blur-md border border-border-subtle shadow-md',
            elevated: 'bg-background border border-border-subtle shadow-lg hover:shadow-xl',
            outlined: 'border border-border-subtle bg-transparent hover:border-primary',
            filled: 'bg-gray-50 border border-border-subtle',
        },
        size: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
        },
        padding: {
            none: 'p-0',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
            xl: 'p-8',
        },
        blur: {
            none: '',
            sm: 'backdrop-blur-xs',
            md: 'backdrop-blur-md',
            lg: 'backdrop-blur-lg',
            xl: 'backdrop-blur-xl',
        },
        hover: {
            true: 'hover:scale-[1.02] hover:shadow-xl cursor-pointer',
            false: '',
        },
    },
    compoundVariants: [
        {
            variant: 'glass',
            blur: 'none',
            class: 'backdrop-blur-none',
        },
        {
            variant: 'glass',
            blur: 'sm',
            class: 'backdrop-blur-xs',
        },
        {
            variant: 'glass',
            blur: 'md',
            class: 'backdrop-blur-md',
        },
        {
            variant: 'glass',
            blur: 'lg',
            class: 'backdrop-blur-lg',
        },
        {
            variant: 'glass',
            blur: 'xl',
            class: 'backdrop-blur-xl',
        },
    ],
    defaultVariants: {
        variant: 'default',
        size: 'md',
        padding: 'md',
        blur: 'md',
        hover: false,
    },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    variant = 'glass',
    size = 'md',
    padding = 'md',
    blur = 'md',
    hover = false,
    children,
    className,
    ...props
}) => {
    const classes = cn(
        cardVariants({
            variant,
            size,
            padding,
            blur,
            hover,
        }),
        className,
    );

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

// Card sub-components
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    children,
    className,
    ...props
}) => (
    <h3
        className={cn(
            'text-lg font-semibold leading-none tracking-tight text-foreground',
            className,
        )}
        {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<
    React.HTMLAttributes<HTMLParagraphElement>
> = ({ children, className, ...props }) => (
    <p className={cn('text-sm text-grey', className)} {...props}>
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn('pt-0', className)} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={cn('flex items-center pt-4', className)} {...props}>
        {children}
    </div>
);

// Status cards for validation results
export interface StatusCardProps extends Omit<CardProps, 'variant'> {
    status: 'success' | 'error' | 'warning' | 'info';
    title: string;
    count?: number;
    icon?: React.ReactNode;
}

const statusCardVariants = tv({
    base: [
        'border-2',
    ],
    variants: {
        status: {
            success: 'border-success/30 bg-success/10',
            error: 'border-error/30 bg-error/10',
            warning: 'border-warning/30 bg-warning/10',
            info: 'border-info/30 bg-info/10',
        },
    },
});

const statusIconVariants = tv({
    base: [
        'shrink-0',
    ],
    variants: {
        status: {
            success: 'text-success',
            error: 'text-error',
            warning: 'text-warning',
            info: 'text-info',
        },
    },
});

const statusCountVariants = tv({
    base: [
        'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-foreground',
    ],
    variants: {
        status: {
            success: 'bg-success',
            error: 'bg-error',
            warning: 'bg-warning',
            info: 'bg-info',
        },
    },
});

export const StatusCard: React.FC<StatusCardProps> = ({
    status,
    title,
    count,
    icon,
    children,
    className,
    ...props
}) => {
    return (
        <Card
            className={cn(
                statusCardVariants({ status }),
                className
            )}
            variant="outlined"
            {...props}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {icon && (
                        <div className={statusIconVariants({ status })}>
                            {icon}
                        </div>
                    )}
                    <div>
                        <h4 className="font-medium text-foreground">{title}</h4>
                        {children && (
                            <p className="text-sm text-grey mt-1">{children}</p>
                        )}
                    </div>
                </div>
                {count !== undefined && (
                    <div className={statusCountVariants({ status })}>
                        {count}
                    </div>
                )}
            </div>
        </Card>
    );
};
