import { Stack, AppBar, Toolbar, IconButton, useTheme, Tooltip } from '@mui/material';
import { useMemo } from 'react';

import AccountPopover from './account-popover';
import { CustomBreadcrumbs, Icon } from '../../../components';
import { IconEnum } from '../../../components/icons/icons';
import { useSettingsContext } from '../../../contexts/settings-provider';
import { useDashboardLayout } from '../../../hook';
import { useResponsive } from '../../../hook/use-responsive';
import { bgBlur } from '../../../theme/styles';
import { HEADER, NAV } from '../../config';


type Props = {
    onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
    const theme = useTheme();
    const lgUp = useResponsive('up', 'md');
    const { navLayout, onToggle } = useSettingsContext();
    const { breadcrumbs, heading } = useDashboardLayout();

    const isNavHorizontal = !lgUp;
    const isNavMini = useMemo(
        () => navLayout === 'mini' && lgUp,
        [lgUp, navLayout],
    );

    const renderContent = (
        <>
            {!lgUp && (
                <IconButton onClick={onOpenNav}>
                    <Icon icon={IconEnum.List} />
                </IconButton>
            )}

            <Stack
                direction="column"
                spacing={0}
            >
                <CustomBreadcrumbs
                    heading={heading}
                    links={breadcrumbs}
                />

            </Stack>

            <Stack
                direction="column"
                spacing={0}
            />

            <Stack
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
                spacing={{
                    xs: 1,
                    sm: 2,
                }}
            >
                <Tooltip title="Notifications">
                    <IconButton>
                        <Icon icon={IconEnum.Bell} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Settings">
                    <IconButton onClick={onToggle}>
                        <Icon icon={IconEnum.Settings} />
                    </IconButton>
                </Tooltip>

                <AccountPopover />
            </Stack>
        </>
    );

    return (
        <AppBar
            sx={{
                boxShadow: 'none',
                borderBottom: `dashed 1px ${theme.palette.divider}`,
                height: HEADER.H_MOBILE,
                zIndex: theme.zIndex.appBar + 1,
                ...bgBlur({
                    color: theme.palette.background.paper,
                }),
                transition: theme.transitions.create(['height'], {
                    duration: theme.transitions.duration.shorter,
                }),
                ...(lgUp && {
                    width: `calc(100% - ${(navLayout === 'mini' ? NAV.W_MINI : NAV.W_VERTICAL) + 1}px)`,
                    height: HEADER.H_DESKTOP,
                    ...(isNavHorizontal && {
                        width: 1,
                        bgcolor: 'background.paper',
                        height: HEADER.H_DESKTOP,
                        borderBottom: `dashed 1px ${theme.palette.divider}`,
                    }),
                    ...(isNavMini && {
                        width: `calc(100% - ${NAV.W_MINI + 1}px)`,
                    }),
                }),
            }}
        >
            <Toolbar
                sx={{
                    height: 1,
                    pr: {
                        lg: 5,
                        xs: 2,
                    },
                    pl: {
                        lg: 5,
                        xs: 2,
                    },

                }}
            >
                {renderContent}
            </Toolbar>
        </AppBar>
    );
}
