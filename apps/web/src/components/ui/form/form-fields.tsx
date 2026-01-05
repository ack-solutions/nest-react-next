'use client';

import React from 'react';
import { useFormContext, Controller, ControllerProps, FieldValues, Path } from 'react-hook-form';
import { Input, InputProps, TextArea, TextAreaProps, Select, SelectProps } from '../input';
import Checkbox, { CheckboxProps } from '../checkbox';
import { cn } from '@web/utils/cn';

// ============================================
// FORM INPUT - Connected to react-hook-form
// ============================================
export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<InputProps, 'name'> {
    name: Path<TFieldValues>;
    label?: string;
    required?: boolean;
}

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    required,
    ...props
}: FormInputProps<TFieldValues>) {
    const { register, formState: { errors } } = useFormContext<TFieldValues>();
    const error = errors[name];

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <Input
                id={name}
                {...register(name)}
                {...props}
                state={error ? 'error' : props.state}
                helperText={error?.message as string || props.helperText}
            />
        </div>
    );
}

// ============================================
// FORM TEXTAREA - Connected to react-hook-form
// ============================================
export interface FormTextAreaProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<TextAreaProps, 'name'> {
    name: Path<TFieldValues>;
    label?: string;
    required?: boolean;
}

export function FormTextArea<TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    required,
    ...props
}: FormTextAreaProps<TFieldValues>) {
    const { register, formState: { errors } } = useFormContext<TFieldValues>();
    const error = errors[name];

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <TextArea
                id={name}
                {...register(name)}
                {...props}
                state={error ? 'error' : props.state}
                helperText={error?.message as string || props.helperText}
            />
        </div>
    );
}

// ============================================
// FORM SELECT - Connected to react-hook-form
// ============================================
export interface FormSelectProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<SelectProps, 'name'> {
    name: Path<TFieldValues>;
    label?: string;
    required?: boolean;
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    required,
    ...props
}: FormSelectProps<TFieldValues>) {
    const { register, formState: { errors } } = useFormContext<TFieldValues>();
    const error = errors[name];

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <Select
                id={name}
                {...register(name)}
                {...props}
                state={error ? 'error' : props.state}
                helperText={error?.message as string || props.helperText}
            />
        </div>
    );
}

// ============================================
// FORM CHECKBOX - Connected to react-hook-form
// ============================================
export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange'> {
    name: Path<TFieldValues>;
}

export function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
    name,
    ...props
}: FormCheckboxProps<TFieldValues>) {
    const { control, formState: { errors } } = useFormContext<TFieldValues>();
    const error = errors[name];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
                <div>
                    <Checkbox
                        {...field}
                        {...props}
                        checked={!!value}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                    {error && (
                        <p className="mt-1 text-sm text-error">{error.message as string}</p>
                    )}
                </div>
            )}
        />
    );
}

// ============================================
// FORM PASSWORD INPUT
// ============================================
export interface FormPasswordInputProps<TFieldValues extends FieldValues = FieldValues>
    extends Omit<FormInputProps<TFieldValues>, 'type'> {
}

export function FormPasswordInput<TFieldValues extends FieldValues = FieldValues>({
    name,
    label,
    required,
    ...props
}: FormPasswordInputProps<TFieldValues>) {
    const [showPassword, setShowPassword] = React.useState(false);
    const { register, formState: { errors } } = useFormContext<TFieldValues>();
    const error = errors[name];

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-foreground">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </label>
            )}
            <Input
                id={name}
                type={showPassword ? 'text' : 'password'}
                {...register(name)}
                {...props}
                state={error ? 'error' : props.state}
                helperText={error?.message as string || props.helperText}
                rightIcon={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                }
            />
        </div>
    );
}
