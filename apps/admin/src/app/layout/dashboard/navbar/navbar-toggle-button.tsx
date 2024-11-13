import { IconButton, IconButtonProps, useTheme } from '@mui/material'
import { NAV } from '../../config'
import {  useSettingsContext } from '@libs/react-core';
import { Icon } from '@admin/app/components';

const NavbarToggleButton = (props: IconButtonProps) => {
  const theme = useTheme()
  const { onUpdate, navLayout } = useSettingsContext();
  return (
    <IconButton
      size="small"
      onClick={() => onUpdate('navLayout', navLayout === 'vertical' ? 'mini' : 'vertical')}
      {...props}
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        //...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default'
        },
        ...props?.sx
      }}
    >
      <Icon
        size={10}
        icon={navLayout === 'vertical' ? 'arrow-left-2' : 'arrow-right-3'}
      />
    </IconButton>
  )
}

export default NavbarToggleButton