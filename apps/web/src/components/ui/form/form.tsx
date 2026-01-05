'use client';

import React, { createContext, useContext } from 'react';
import {
    useForm,
    UseFormReturn,
    FieldValues,
    SubmitHandler,
    UseFormProps,
    FormProvider,
    useFormContext,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { cn } from '@web/utils/cn';
import { Stack } from '../stack';

// ============================================
// FORM CONTEXT
// ============================================
interface FormContextValue {
    isSubmitting: boolean;
}

const FormContext = createContext<FormContextValue>({ isSubmitting: false });

export const useFormStatus = () => useContext(FormContext);

// ============================================
// FORM COMPONENT
// ============================================
export interface FormProps<TFieldValues extends FieldValues>
    extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    form: UseFormReturn<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
    children: React.ReactNode;
    className?: string;
}

export function Form<TFieldValues extends FieldValues>({
    form,
    onSubmit,
    children,
    className,
    ...props
}: FormProps<TFieldValues>) {
    const isSubmitting = form.formState.isSubmitting;

    return (
        <FormProvider {...form}>
            <FormContext.Provider value={{ isSubmitting }}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn('space-y-5', className)}
                    {...props}
                >
                    {children}
                </form>
            </FormContext.Provider>
        </FormProvider>
    );
}

// ============================================
// USE FORM HOOK WITH YUP
// ============================================
export function useAppForm<TFieldValues extends FieldValues>(
    options?: UseFormProps<TFieldValues> & {
        schema?: ObjectSchema<any>;
    }
) {
    const { schema, ...restOptions } = options || {};

    return useForm<TFieldValues>({
        ...restOptions,
        resolver: schema ? (yupResolver(schema) as any) : undefined,
    });
}

// ============================================
// FORM FIELD WRAPPER
// ============================================
export interface FormFieldProps {
    name: string;
    label?: string;
    required?: boolean;
    description?: string;
    className?: string;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    required,
    description,
    className,
    children,
}) => {
    const form = useFormContext();
    const error = form?.formState?.errors?.[name];

    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-foreground"
                >
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            {children}
            {description && !error && (
                <p className="text-sm text-text-secondary">{description}</p>
            )}
            {error && (
                <p className="text-sm text-error">{error.message as string}</p>
            )}
        </div>
    );
};

// ============================================
// FORM ROW (For horizontal layouts)
// ============================================
export interface FormRowProps {
    children: React.ReactNode;
    className?: string;
    columns?: 1 | 2 | 3 | 4;
}

export const FormRow: React.FC<FormRowProps> = ({
    children,
    className,
    columns = 2,
}) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={cn('grid gap-4', gridCols[columns], className)}>
            {children}
        </div>
    );
};

// ============================================
// FORM SECTION
// ============================================
export interface FormSectionProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
    title,
    description,
    children,
    className,
}) => {
    return (
        <div className={cn('space-y-4', className)}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    )}
                    {description && (
                        <p className="text-sm text-text-secondary">{description}</p>
                    )}
                </div>
            )}
            <Stack spacing={4} direction="column">
                {children}
            </Stack>
        </div>
    );
};

// ============================================
// FORM ACTIONS
// ============================================
export interface FormActionsProps {
    children: React.ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right' | 'between';
}

export const FormActions: React.FC<FormActionsProps> = ({
    children,
    className,
    align = 'right',
}) => {
    const alignClasses = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div className={cn('flex items-center gap-3 pt-4', alignClasses[align], className)}>
            {children}
        </div>
    );
};

// ============================================
// FORM ERROR DISPLAY
// ============================================
export interface FormErrorProps {
    message?: string | null;
    className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 p-4',
                className
            )}
            role="alert"
        >
            <svg
                className="w-5 h-5 text-error shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p className="text-sm text-error leading-snug">{message}</p>
        </div>
    );
};

// ============================================
// FORM SUCCESS
// ============================================
export interface FormSuccessProps {
    message?: string | null;
    className?: string;
}

export const FormSuccess: React.FC<FormSuccessProps> = ({ message, className }) => {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4',
                className
            )}
            role="status"
        >
            <svg
                className="w-5 h-5 text-success shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p className="text-sm text-success leading-snug">{message}</p>
        </div>
    );
};
