import React from 'react'
import { cn } from '@web/utils/cn'

interface ContainerProps {
    children: React.ReactNode
    className?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    component?: React.ElementType
    id?: string
}

const Container: React.FC<ContainerProps> = ({
    children,
    className,
    maxWidth = 'xl',
    component: Component = 'div',
    ...props
}) => {
    const maxWidthClasses = {
        sm: 'max-w-full sm:max-w-sm',                           // Full on mobile, ~384px on sm+
        md: 'max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl',   // Full on mobile, ~672px on sm+, ~896px on lg+, ~1024px on xl+
        lg: 'max-w-full sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl',   // Full on mobile, ~896px on sm+, ~1152px on lg+, ~1280px on xl+
        xl: 'max-w-full sm:max-w-5xl lg:max-w-7xl xl:max-w-[1440px]', // Full on mobile, ~1024px on sm+, ~1280px on lg+, 1400px on xl+
        full: 'max-w-full'
    }

    return (
        <Component
            className={cn(
                'w-full',
                'mx-auto',
                'px-4',
                maxWidthClasses[maxWidth],
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
}

export { Container }
