import { errorMessage } from '@libs/utils';
import { useCallback } from 'react';
import { ExternalToast, toast } from 'sonner';


export type VariantType =
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'custom'
    | 'message'
    | 'promise'
    | 'dismiss'
    | 'loading';
// type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);
// type PromiseTResult<Data = any> = string | React.ReactNode | ((data: Data) => React.ReactNode | string | Promise<React.ReactNode | string>);
// type PromiseExternalToast = Omit<ExternalToast, 'description'>;
// type PromiseData<ToastData = any> = PromiseExternalToast & {
//   loading?: string | React.ReactNode;
//   success?: PromiseTResult<ToastData>;
//   error?: PromiseTResult;
//   description?: PromiseTResult;
//   finally?: () => void | Promise<void>;
// };

export function useToasty() {
    const showToasty = useCallback(
        (
            message,
            variant: VariantType = 'success',
            options: ExternalToast = {},
        ) => {
            message = errorMessage(message);
            switch (variant) {
                case 'success':
                    toast.success(message, options);

                    break;
                case 'info':
                    toast.info(message, options);

                    break;
                case 'warning':
                    toast.warning(message, options);

                    break;
                case 'error':
                    toast.error(message, options);

                    break;
                case 'custom':
                    toast.custom(message, options);

                    break;
                case 'message':
                    toast.message(message, options);

                    break;
                case 'promise':
                    toast.promise(message, options);

                    break;
                case 'loading':
                    toast.loading(message, options);

                    break;
                default:
                    toast.success(message, options);

                    break;
            }
        },
        [],
    );
    const dismissToasty = useCallback((id?: string | number) => {
        toast.dismiss(id);
    }, []);
    // const promiseToasty = useCallback(
    //    <ToastData>(promise: PromiseT<ToastData[]>, data?: PromiseData<any[]>): Promise<ToastData> => {

    //     return  toast.promise( promise, data// Optionally add custom toast options here );

    //   },
    //   [],
    // )

    return {
        showToasty,
        dismissToasty,
        // promiseToasty
    };
}
