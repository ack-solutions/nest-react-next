/**
 * =================================================================
 * FORM CONTAINER
 * =================================================================
 *
 * Wrapper component for react-hook-form that provides form context
 * and handles form submission for React Native.
 */

import React, { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    FormProvider,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
    useFormContext,
    UseFormProps,
    UseFormReturn,
    FieldValues,
} from 'react-hook-form';
import { AnyObjectSchema } from 'yup';

export interface FormContainerProps<T extends FieldValues = FieldValues>
    extends UseFormProps<T> {
    /** Called on successful form submission */
    onSuccess?: SubmitHandler<T>;
    /** Called on form validation errors */
    onError?: SubmitErrorHandler<T>;
    /** Existing form context (if managing form externally) */
    formContext?: UseFormReturn<T>;
    /** Yup validation schema */
    validationSchema?: AnyObjectSchema;
    /** Container style */
    style?: ViewStyle;
}

/**
 * FormContainer - Wrapper for react-hook-form in React Native
 *
 * Usage:
 * ```tsx
 * <FormContainer
 *   validationSchema={loginSchema}
 *   defaultValues={{ email: '', password: '' }}
 *   onSuccess={(data) => handleLogin(data)}
 * >
 *   <RHFTextField name="email" label="Email" />
 *   <RHFPassword name="password" label="Password" />
 *   <SubmitButton />
 * </FormContainer>
 * ```
 */
export function FormContainer<TFieldValues extends FieldValues = FieldValues>({
    children,
    formContext,
    onSuccess,
    onError,
    validationSchema,
    style,
    ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
    // If formContext is provided externally, use it
    if (formContext) {
        return (
            <FormProvider {...formContext}>
                <View style={style}>{children}</View>
            </FormProvider>
        );
    }

    // Otherwise, create a new form context
    return (
        <FormProviderWithContext<TFieldValues>
            onSuccess={onSuccess}
            onError={onError}
            validationSchema={validationSchema}
            style={style}
            {...useFormProps}
        >
            {children}
        </FormProviderWithContext>
    );
}

/**
 * Internal component that creates form context
 */
function FormProviderWithContext<TFieldValues extends FieldValues = FieldValues>({
    children,
    onSuccess,
    onError,
    validationSchema,
    style,
    ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
    const methods = useForm<TFieldValues>({
        ...useFormProps,
        ...(validationSchema && {
            resolver: yupResolver(validationSchema) as any,
        }),
    });

    return (
        <FormProvider {...methods}>
            <View style={style}>{children}</View>
        </FormProvider>
    );
}

/**
 * Hook to get submit handler from form context
 * Use this with your submit button
 */
export function useFormSubmit<T extends FieldValues>() {
    const formContext = useFormContext<T>();

    return {
        handleSubmit: formContext.handleSubmit,
        isSubmitting: formContext.formState.isSubmitting,
        isValid: formContext.formState.isValid,
        errors: formContext.formState.errors,
    };
}

export default FormContainer;
