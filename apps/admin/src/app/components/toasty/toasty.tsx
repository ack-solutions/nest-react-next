import Portal from '@mui/material/Portal';

import { StyledToaster } from './styles';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export const toasterClasses = {
    root: 'toaster__root',
    toast: 'toaster__toast',
    title: 'toaster__title',
    icon: 'toaster__icon',
    iconSvg: 'toaster__icon__svg',
    content: 'toaster__content',
    description: 'toaster__description',
    actionButton: 'toaster__action__button',
    cancelButton: 'toaster__cancel__button',
    closeButton: 'toaster__close_button',
    loadingIcon: 'toaster__loading_icon',

    default: 'toaster__default',
    error: 'toaster__error',
    success: 'toaster__success',
    warning: 'toaster__warning',
    info: 'toaster__info',

    loader: 'sonner-loader',
    loaderVisible: '&[data-visible="true"]',
    closeBtnVisible: '[data-close-button="true"]',
};

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
                className={toasterClasses.root}
                toastOptions={{
                    unstyled: true,
                    classNames: {
                        toast: toasterClasses.toast,
                        icon: toasterClasses.icon,
                        // content class
                        content: toasterClasses.content,
                        title: toasterClasses.title,
                        description: toasterClasses.description,
                        // button class
                        actionButton: toasterClasses.actionButton,
                        cancelButton: toasterClasses.cancelButton,
                        closeButton: toasterClasses.closeButton,
                        // state class
                        default: toasterClasses.default,
                        info: toasterClasses.info,
                        error: toasterClasses.error,
                        success: toasterClasses.success,
                        warning: toasterClasses.warning,
                    },
                }}
                icons={{
                    loading: <span className={toasterClasses.loadingIcon} />,
                    info: (
                        <Icon
                            className={toasterClasses.iconSvg}
                            icon={IconEnum.Info}
                        />
                    ),
                    success: (
                        <Icon
                            className={toasterClasses.iconSvg}
                            icon={IconEnum.CircleCheck}
                        />
                    ),
                    warning: (
                        <Icon
                            className={toasterClasses.iconSvg}
                            icon={IconEnum.TriangleAlert}
                        />
                    ),
                    error: (
                        <Icon
                            className={toasterClasses.iconSvg}
                            icon={IconEnum.CircleAlert}
                        />
                    ),
                }}
            />
        </Portal>
    );
}
