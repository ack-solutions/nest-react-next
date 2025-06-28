import { IconButton, IconButtonProps, useTheme } from '@mui/material';

import { Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import { useSettingsContext } from '../../../contexts/settings-provider';
import { NAV } from '../../config';


function NavbarToggleButton(props: IconButtonProps) {
    const theme = useTheme();
    const { onUpdate, navLayout } = useSettingsContext();
    return (
        <IconButton
            className="nav-toggle-button"
            onClick={() => onUpdate(
                'navLayout',
                navLayout === 'vertical' ? 'mini' : 'vertical',
            )}
            {...props}
            sx={{
                p: 0.5,
                top: 20,
                position: 'fixed',
                left: NAV.W_VERTICAL - 12,
                zIndex: theme.zIndex.appBar + 1,
                border: `dashed 1px ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                '&:hover': {
                    bgcolor: 'background.default',
                },
                ...props?.sx,
            }}
        >
            <Icon
                icon={
                    navLayout === 'vertical' ? IconEnum.CARET_LEFT : IconEnum.CARET_RIGHT
                }
                size="x-small"
            />
        </IconButton>
    );
}

export default NavbarToggleButton;
