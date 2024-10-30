import { Collapse, List, ListSubheader, styled } from '@mui/material';
import React, { useCallback, useState } from 'react'
import { NavbarConfigProps, NavigationItem } from '../../../types/navigation';
import NavbarList from './navbar-list';

const StyledSubheader = styled(ListSubheader)<{ config?: NavbarConfigProps; }>(({ config, theme }) => ({
  ...theme.typography.overline,
  fontSize: 11,
  cursor: 'pointer',
  display: 'inline-flex',
  padding: config?.itemPadding,
  paddingTop: theme.spacing(2),
  marginBottom: config?.itemGap,
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.disabled,
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.shortest
  }),
  '&:hover': {
    color: theme.palette.text.primary
  }
}));

interface NavGroupProps {
  subheader?: string;
  items: NavigationItem[];
  config?: NavbarConfigProps;
  initialStatus?: boolean;
  isMini?: boolean;
};

export function NavbarGroup({ subheader, items, config, initialStatus, isMini }: NavGroupProps) {
  const [open, setOpen] = useState(!initialStatus);

  const handleToggle = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  if (isMini) {
    return (
      items.map((list) => (
        <NavbarList
          key={list.id || list.title}
          data={list}
          depth={1}
          hasChild={!!list.children}
          config={config}
          isMini={isMini}
        />
      )))

  }

  return (
    <List disablePadding sx={{ px: 2 }}>
      {subheader ? (
        <>
          <StyledSubheader
            disableGutters
            disableSticky
            onClick={handleToggle}
            config={config}
          >
            {subheader}
          </StyledSubheader>

          <Collapse in={open}>
            {items.map((list) => (
              <NavbarList
                key={list.id || list.title}
                data={list}
                depth={1}
                hasChild={!!list.children}
                config={config}
              />
            ))}
          </Collapse>
        </>
      ) : items.map((list) => (
        <NavbarList
          key={list.id || list.title}
          data={list}
          depth={1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </List>
  )
}

export default NavbarGroup