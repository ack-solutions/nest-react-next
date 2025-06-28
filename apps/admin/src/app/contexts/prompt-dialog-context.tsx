/* eslint-disable react/no-multi-comp */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import defaultsDeep from 'lodash/defaultsDeep';
import {
    useCallback,
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode,
} from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import { DefaultDialog, DefaultDialogProps } from '../components';
import { FormContainer, RHFTextField, RHFTextFieldProps } from '../form';


// --------------------
// Types & Interfaces
// --------------------

interface PromptDialogOptions extends Omit<PromptDialogProps, 'resolveReject' | 'onClose'> { }

interface PromptDialogProviderProps {
    children: ReactNode;
    dialogDefaults?: PromptDialogOptions;
}

interface PromptDialogProps extends DefaultDialogProps {
    description?: string;
    buttonText?: string;
    resolveReject?: [(value?: any) => void, (reason?: any) => void] | null;
    inputProps?: RHFTextFieldProps;
    initialValue?: any;
    validationSchema?: any;
    subTitle?: string | ReactNode;
}

// --------------------
// Context
// --------------------

type PromptDialogHandler = (options: PromptDialogOptions | string) => Promise<any>;

const PromptDialogContext = createContext<PromptDialogHandler | null>(null);

// --------------------
// PromptDialog
// --------------------

function PromptDialog({
    buttonText = 'Save',
    description,
    resolveReject,
    onClose,
    inputProps = {
        name: 'prompt',
    },
    initialValue = {},
    validationSchema,
    subTitle,
    ...dialogProps
}: PromptDialogProps) {
    const formContext: UseFormReturn = useForm({
        defaultValues: initialValue,
        resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    });

    const { reset, handleSubmit, formState: { isSubmitting } } = formContext;
    const [resolve, reject] = resolveReject || [];

    const handleCancel = useCallback(() => {
        reject?.();
        onClose?.();
    }, [reject, onClose]);

    const handleFormSubmit = useCallback(
        async (values: any) => {
            await resolve?.(values);
            onClose?.();
        },
        [resolve, onClose],
    );

    useEffect(() => {
        reset(initialValue);
    }, [initialValue, reset]);

    return (
        <DefaultDialog
            fullWidth
            maxWidth="sm"
            onClose={handleCancel}
            actions={(
                <>
                    <Button
                        variant="contained"
                        color="inherit"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        onClick={handleSubmit(handleFormSubmit)}
                    >
                        {buttonText}
                    </Button>
                </>
            )}
            {...dialogProps}
        >
            {typeof subTitle === 'string' ? (
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 2 }}
                >
                    {subTitle}
                </Typography>
            ) : (
                subTitle
            )}

            <FormContainer
                formContext={formContext}
                onSuccess={handleFormSubmit}
            >
                <RHFTextField
                    fullWidth
                    autoFocus
                    {...inputProps}
                />
            </FormContainer>
        </DefaultDialog>
    );
}

// --------------------
// Provider
// --------------------

export function PromptDialogProvider({
    children,
    dialogDefaults = {},
}: PromptDialogProviderProps) {
    const [dialogOptions, setDialogOptions] = useState<PromptDialogProps | null>(null);
    const [resolveReject, setResolveReject] = useState<[(value?: any) => void, (reason?: any) => void] | null>(null);

    const openPromptDialog = useCallback<PromptDialogHandler>((options) => {
        return new Promise((resolve, reject) => {
            const mergedOptions = defaultsDeep(
                typeof options === 'string' ? { description: options } : options,
                dialogDefaults,
            );

            setDialogOptions(mergedOptions as PromptDialogProps);
            setResolveReject([resolve, reject]);
        });
    }, [dialogDefaults]);

    const handleClose = useCallback(() => {
        setResolveReject(null);
        setDialogOptions(null);
    }, []);

    return (
        <PromptDialogContext.Provider value={openPromptDialog}>
            {children}
            {resolveReject && dialogOptions ? (
                <PromptDialog
                    {...dialogOptions}
                    resolveReject={resolveReject}
                    onClose={handleClose}
                />
            ) : null}
        </PromptDialogContext.Provider>
    );
}


export const usePromptDialog = () => {
    const context = useContext(PromptDialogContext);
    if (!context) throw new Error('usePromptDialog must be used within PromptDialogProvider');
    return context;
};
