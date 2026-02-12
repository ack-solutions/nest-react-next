import Portal from '@mui/material/Portal';

import { StyledToaster } from './styles';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';

export function Toasty() {
    return (
        <Portal>
            <StyledToaster
                expand
                gap={12}
                closeButton
                offset={16}
                visibleToasts={4}
                position="top-right"
                className="toaster__root"
                toastOptions={{
                    unstyled: true,
                    classNames: {
                        toast: 'toaster__toast',
                        icon: 'toaster__icon',
                        content: 'toaster__content',
                        title: 'toaster__title',
                        description: 'toaster__description',
                        actionButton: 'toaster__action__button',
                        cancelButton: 'toaster__cancel__button',
                        closeButton: 'toaster__close_button',
                        default: 'toaster__default',
                        info: 'toaster__info',
                        error: 'toaster__error',
                        success: 'toaster__success',
                        warning: 'toaster__warning',
                    },
                }}
                icons={{
                    loading: <span className="toaster__loading_icon" />,
                    info: (
                        <Icon
                            className="toaster__icon__svg"
                            icon={IconEnum.Info}
                        />
                    ),
                    success: (
                        <Icon
                            className="toaster__icon__svg"
                            icon={IconEnum.CircleCheck}
                        />
                    ),
                    warning: (
                        <Icon
                            className="toaster__icon__svg"
                            icon={IconEnum.TriangleAlert}
                        />
                    ),
                    error: (
                        <Icon
                            className="toaster__icon__svg"
                            icon={IconEnum.CircleAlert}
                        />
                    ),
                }}
            />
        </Portal>
    );
}
