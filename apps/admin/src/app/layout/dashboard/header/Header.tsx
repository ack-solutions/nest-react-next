import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, IconButton } from '@mui/material';
import { HEADER, NAV } from '../../config';
import { useLocation } from 'react-router-dom';
import { useScroll, UseScrollOptions } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon, useResponsive } from '@mlm/react-core';
import AccountPopover from './account-popover';
import { bgBlur } from '../../../theme/styles';



type Props = {
  onOpenNav?: VoidFunction;
};

export function useOffSetTop(top = 0, options?: UseScrollOptions) {
  const { scrollY } = useScroll(options);
  const [value, setValue] = useState(false);
  const onOffSetTop = useCallback(() => {
    scrollY.on('change', (scrollHeight) => {
      if (scrollHeight > top) {
        setValue(true);
      } else {
        setValue(false);
      }
    });
  }, [scrollY, top]);

  useEffect(() => {
    onOffSetTop();
  }, [onOffSetTop]);

  const memoizedValue = useMemo(() => value, [value]);

  return memoizedValue;
}

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();
  const { pathname } = useLocation();
  //const settings = useSettingsContext();
  const lgUp = useResponsive('up', 'lg');
  const offset = useOffSetTop(HEADER.H_DESKTOP);
  const offsetTop = offset;
  const isNavHorizontal = !lgUp
  const isNavMini = !lgUp
  // const titleFromPath = usePageTitle(pathname ?? '');
  // const { heading, breadcrumbs } = useDashboardLayout();

  // const pageTitle = useMemo(() => heading || titleFromPath, [heading, titleFromPath])
  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <Icon icon='' />
        </IconButton>
      )}

      {/* <Searchbar /> */}

      <Stack direction='column' spacing={0}>
        {/* {pageTitle && (
          <Typography variant="h5">
            {pageTitle}
          </Typography>
        )} */}

        {/* {breadcrumbs?.length > 0 && (
          <Breadcrumbs separator={(
            <Box
              component="span"
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: 'text.disabled'
              }}
            />
          )}
          >
            {breadcrumbs.map((link) => (
              <BreadcrumbsLink
                key={link.name || ''}
                link={link}
                disabled={link.name === breadcrumbs[breadcrumbs.length - 1]?.name}
              />
            ))}
          </Breadcrumbs>
        )} */}
      </Stack>


      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        {/* <SettingsButton /> */}
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        color: 'transparent',
        boxShadow:'none',
        borderBottom: `dashed 1px ${theme.palette.divider}`,
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`
          })
        })
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 }
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );

}
