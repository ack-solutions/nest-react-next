
import { OptionsObject, useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';
import { errorMessage } from '../utils';

export  function useToasty() {
  const { enqueueSnackbar } = useSnackbar();

  const showToasty = useCallback(
    (message:string, variant: VariantType = 'success', options?: OptionsObject) => {
      enqueueSnackbar(
        errorMessage(message),
        {
          variant: variant,
          autoHideDuration: variant === 'success' ? 1000 : 5000,
          ...options
        },
      )
    },
    [enqueueSnackbar],
  )

  return {
    showToasty
  };
}
