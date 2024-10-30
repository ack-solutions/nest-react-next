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
import { Icon } from './icon';

// DefaultDialogProps now extends DialogProps but leaves 'open' flexible, managed outside
export interface DefaultDialogProps extends Omit<DialogProps, 'open'> {
  open?: boolean;
  title?: string;
  actions?: ReactNode;
  onClose?: () => void;
}

// DefaultDialog component updated for flexibility and responsiveness
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
      open={open ?? true} // Keep open externally controlled
      maxWidth={dialogProps.maxWidth || 'md'} // Default maxWidth to 'md'
      fullScreen={fullScreen} // Responsive fullScreen for smaller screens
      onClose={onClose}
      {...dialogProps}
    >
      {/* Dialog Title Section */}
      {title && (
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Icon icon='close' />
          </IconButton>
        </DialogTitle>
      )}

      {/* Dialog Content */}
      <DialogContent dividers>{children}</DialogContent>

      {/* Dialog Actions */}
      {actions && (
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DefaultDialog;