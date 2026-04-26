import { List, ListSubheader, styled } from '@mui/material';

import { NavigationGroup, NavigationItem } from './navigation-config';
import NavigationItemComponent from './navigation-item';

interface NavigationGroupProps {
    group: NavigationGroup;
    isItemActive: (item: NavigationItem) => boolean;
    isCompact?: boolean;
    onClose?: () => void;
}

const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
    ...theme.typography.overline,
    fontSize: 11,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 4,
    color: theme.palette.text.secondary,
    backgroundColor: 'transparent',
    lineHeight: 1.5,
    letterSpacing: '0.08em',
    fontWeight: 700,
}));

const StyledList = styled(List)(() => ({
    padding: '0 8px',
    '& .MuiListItemButton-root': {
        marginBottom: 2,
    },
}));

export default function NavigationGroupComponent({
    group,
    isItemActive,
    isCompact = false,
    onClose,
}: NavigationGroupProps) {
    if (isCompact) {
        return (
            <>
                {group.items.map((item) => (
                    <NavigationItemComponent
                        key={item.id}
                        item={item}
                        isActive={isItemActive(item)}
                        isCompact
                        onClose={onClose}
                        isItemActive={isItemActive}
                    />
                ))}
            </>
        );
    }

    return (
        <StyledList disablePadding>
            {group.items.length > 0 && (
                <StyledListSubheader disableGutters disableSticky>
                    {group.label.toUpperCase()}
                </StyledListSubheader>
            )}

            {group.items.map((item) => (
                <NavigationItemComponent
                    key={item.id}
                    item={item}
                    isActive={isItemActive(item)}
                    isCompact={false}
                    onClose={onClose}
                    isItemActive={isItemActive}
                />
            ))}
        </StyledList>
    );
}
