import React, { FC, ReactNode } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Icon } from '@libs/react-core';

export interface DefaultDialogProps extends Omit<DialogProps, 'open'> {
    open?: boolean;
    title?: string;
    actions?: ReactNode;
    onClose?: () => void;
}

const DefaultDialog = ({
    open,
    title,
    children,
    actions,
    onClose,
    ...dialogProps
}: DefaultDialogProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            open={open ?? true}
            fullWidth
            maxWidth={dialogProps.maxWidth || 'md'}
            fullScreen={fullScreen}
            onClose={onClose}
            {...dialogProps}
        >

            {title && (
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Icon icon='close' size='small' />
                    </IconButton>
                </DialogTitle>
            )}
            <DialogContent dividers>{children}</DialogContent>
            {actions && (
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default DefaultDialog;
