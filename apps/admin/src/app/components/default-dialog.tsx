import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { ReactNode } from 'react';

import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';


export interface DefaultDialogProps extends Omit<DialogProps, 'open'> {
    open?: boolean;
    title?: string;
    actions?: ReactNode;
    onClose?: () => void;
}

export function DefaultDialog({
    open,
    title,
    children,
    actions,
    onClose,
    ...dialogProps
}: DefaultDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            open={open ?? true} // Keep open externally controlled
            maxWidth={dialogProps.maxWidth || 'md'} // Default maxWidth to 'md'
            fullScreen={fullScreen} // Responsive fullScreen for smaller screens
            onClose={onClose}
            {...dialogProps}
        >
            {/* Dialog Title Section */}
            {title ? (
                <DialogTitle
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {title}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 13,
                        }}
                    >
                        <Icon
                            size="small"
                            icon={IconEnum.X}
                        />
                    </IconButton>
                </DialogTitle>
            ) : null}

            {/* Dialog Content */}
            <DialogContent dividers>{children}</DialogContent>

            {/* Dialog Actions */}
            {actions ? (
                <DialogActions
                    sx={{
                        p: 2,
                        justifyContent: 'flex-end',
                    }}
                >
                    {actions}
                </DialogActions>
            ) : null}
        </Dialog>
    );
}
