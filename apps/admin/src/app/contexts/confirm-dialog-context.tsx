import {
    Button,
    ButtonProps,
    DialogContentText,
    Stack,
} from '@mui/material';
import {
    useCallback,
    useContext,
    useState,
    createContext,
    ReactNode,
} from 'react';

import DefaultDialog, { DefaultDialogProps } from '../components/default-dialog';


export const ConfirmContext = createContext<any>(null);

export interface ConfirmDialogProps extends DefaultDialogProps {
    message?: string;
    yesText?: string;
    noText?: string;
    yesButtonProps?: ButtonProps;
    noButtonProps?: ButtonProps;
    resolveReject?: [() => void, () => void];
    onClose: () => void;
}

const ConfirmDialog = ({
    noButtonProps,
    title = 'Confirm',
    noText = 'No',
    yesButtonProps,
    yesText = 'Yes',
    message,
    resolveReject,
    onClose,
    ...dialogProps
}: ConfirmDialogProps) => {
    const [resolve, reject] = resolveReject || [];

    const handleCancel = useCallback(() => {
        if (reject) {
            reject();
        }
        if (onClose) {
            onClose();
        }
    }, [reject, onClose]);

    const handleConfirm = useCallback(() => {
        if (resolve) {
            resolve();
        }
        if (onClose) {
            onClose();
        }
    }, [resolve, onClose]);

    return (
        <DefaultDialog
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            actions={
                <Stack
                    direction='row'
                    spacing={2}
                    justifyContent='end'
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        {...noButtonProps}
                        onClick={handleCancel}
                    >
                        {noText}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        {...yesButtonProps}
                        onClick={handleConfirm}
                    >
                        {yesText}
                    </Button>
                </Stack>
            }
            title={title}
            {...dialogProps}
        >
            {message && <DialogContentText>{message}</DialogContentText>}
        </DefaultDialog>
    );
};

export default ConfirmDialog;

interface ConfirmProviderProps {
    children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
    const [dialogProps, setDialogProps] = useState<Partial<ConfirmDialogProps> | null>(null);
    const [resolveReject, setResolveReject] = useState<[() => void, () => void] | null>(null);

    const confirm = (options: Partial<ConfirmDialogProps>) => new Promise<void>((resolve, reject) => {
        if (typeof options === 'string') {
            options = { message: options };
        }
        setDialogProps(options);
        setResolveReject([resolve, reject]);
    });

    const handleClose = () => {
        setDialogProps(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {dialogProps && resolveReject && (
                <ConfirmDialog
                    {...dialogProps}
                    resolveReject={resolveReject}
                    onClose={handleClose}
                />
            )}
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const confirm = useContext(ConfirmContext);
    if (!confirm) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return confirm;
};
