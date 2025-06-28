/* eslint-disable react/no-multi-comp */
import { yupResolver } from '@hookform/resolvers/yup';
import { FormEventHandler, FormHTMLAttributes, PropsWithChildren } from 'react';
import {
    FormProvider,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
    UseFormProps,
    UseFormReturn,
} from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';


export type FormContainerProps<T extends FieldValues = FieldValues> =
    PropsWithChildren<
        UseFormProps<T> & {
            onSuccess?: SubmitHandler<T>;
            onError?: SubmitErrorHandler<T>;
            formProps?: FormHTMLAttributes<HTMLFormElement>;
            handleSubmit?: FormEventHandler<HTMLFormElement>;
            formContext?: UseFormReturn<T>;
            validationSchema?: any;
        }
    >;

export function FormContainer<TFieldValues extends FieldValues = FieldValues>({
    handleSubmit,
    children,
    formProps,
    formContext,
    onSuccess,
    onError,
    ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
    if (!formContext) {
        return (
            <FormProviderWithoutContext<TFieldValues>
                {...{
                    onSuccess,
                    onError,
                    formProps,
                    children,
                    ...useFormProps,
                }}
            />
        );
    }
    if (typeof onSuccess === 'function' && typeof handleSubmit === 'function') {
        console.warn(
            'Property `onSuccess` will be ignored because handleSubmit is provided',
        );
    }
    return (
        <FormProvider {...formContext}>
            <form
                noValidate
                {...formProps}
                onSubmit={
                    handleSubmit ||
                    (onSuccess ?
                        formContext.handleSubmit(onSuccess, onError) :
                        () => console.warn(
                            'submit handler `onSuccess` is missing',
                        ))
                }
            >
                {children}
            </form>
        </FormProvider>
    );
}

function FormProviderWithoutContext<
    TFieldValues extends FieldValues = FieldValues
>({
    onSuccess,
    onError,
    formProps,
    children,
    validationSchema,
    ...useFormProps
}: PropsWithChildren<FormContainerProps<TFieldValues>>) {
    const methods = useForm({
        ...useFormProps,
        ...(validationSchema && {
            resolver: yupResolver(validationSchema as AnyObjectSchema),
        }),
    });

    const { handleSubmit } = methods;

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(
                    onSuccess ?
                        (onSuccess as any) :
                        (_e?: any) => console.warn(
                            'submit handler `onSuccess` is missing',
                        ) as any,
                    onError ?
                        (onError as any) :
                        (_e?: any) => console.warn(
                            'submit handler `onError` is missing',
                        ) as any,
                )}
                noValidate
                {...formProps}
            >
                {children}
            </form>
        </FormProvider>
    );
}
