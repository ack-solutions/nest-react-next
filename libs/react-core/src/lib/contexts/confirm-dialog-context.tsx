import {
  Button,
  ButtonProps,
  DialogContentText
} from '@mui/material';
import React, {
  FC,
  useCallback,
  useContext,
  useState,
  createContext,
  ReactNode
} from 'react';
import DefaultDialog, { DefaultDialogProps } from '../components/default-dialog';

// Create ConfirmContext with a default value of null
export const ConfirmContext = createContext<any>(null);

// Define ConfirmDialog props
export interface ConfirmDialogProps extends DefaultDialogProps {
  description?: string;
  yesText?: string;
  noText?: string;
  yesButtonProps?: ButtonProps;
  noButtonProps?: ButtonProps;
  resolveReject?: [() => void, () => void];
}

// Set default props for ConfirmDialog
export const defaultProps = {
  title: 'Confirm',
  description: '',
  yesText: 'Delete',
  noText: 'Cancel',
  dialogProps: {},
  yesButtonProps: {},
  noButtonProps: {},
};

// ConfirmDialog component
const ConfirmDialog = ({
  noButtonProps,
  noText,
  yesButtonProps,
  yesText,
  description,
  resolveReject,
  onClose,
  ...dialogProps
}: ConfirmDialogProps) => {
  const [resolve, reject] = resolveReject || [];

  // Handle cancel button action
  const handleCancel = useCallback(() => {
    reject && reject();
    onClose && onClose();
  }, [reject, onClose]);

  // Handle confirm button action
  const handleConfirm = useCallback(() => {
    resolve && resolve();
    onClose && onClose();
  }, [resolve, onClose]);

  return (
    <DefaultDialog
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      actions={
        <>
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
        </>
      }
      {...dialogProps}
    >
      {description && <DialogContentText>{description}</DialogContentText>}
    </DefaultDialog>
  );
};

export default ConfirmDialog;

// ConfirmProvider Component to provide the confirm dialog context
interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider: FC<ConfirmProviderProps> = ({ children }) => {
  const [dialogProps, setDialogProps] = useState<Partial<ConfirmDialogProps> | null>(null);
  const [resolveReject, setResolveReject] = useState<[() => void, () => void] | null>(null);

  const confirm = (props: Partial<ConfirmDialogProps>) =>
    new Promise<void>((resolve, reject) => {
      setDialogProps(props);
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

// useConfirm hook to access the confirm function
export const useConfirm = () => {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return confirm;
};