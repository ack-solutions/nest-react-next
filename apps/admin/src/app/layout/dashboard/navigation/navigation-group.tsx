import {
    List,
    ListSubheader,
    styled,
} from '@mui/material';

import { NavigationGroup } from './navigation-config';
import NavigationItemComponent from './navigation-item';
import { RequirePermission, RequireRole } from '@ackplus/nest-auth-react';


interface NavigationGroupProps {
    group: NavigationGroup;
    isItemActive: (item: any) => boolean;
    isCompact?: boolean;
    onClose?: () => void;
}

const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
    ...theme.typography.overline,
    fontSize: 11,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 4,
    color: theme.palette.text.disabled,
    backgroundColor: 'transparent',
    lineHeight: 1.5,
}));

const StyledList = styled(List)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    '& .MuiListItemButton-root': {
        marginBottom: 4,
    },
}));

export default function NavigationGroupComponent({
    group,
    isItemActive,
    isCompact = false,
    onClose,
}: NavigationGroupProps) {
    // Don't show group header in compact mode
    const showHeader = !isCompact && group.items.length > 0;

    if (isCompact) {
        // In compact mode, render items without grouping
        return (
            <>
                {group.items.map((item) => (
                    <RequireRole key={item.id} role={item.roles}>
                        <RequirePermission permission={item.permissions}>
                            <NavigationItemComponent
                                item={item}
                                isActive={isItemActive(item)}
                                isCompact={isCompact}
                                onClose={onClose}
                                isItemActive={isItemActive}
                            />
                        </RequirePermission>
                    </RequireRole>
                ))}
            </>
        );
    }

    return (
        <RequireRole role={group.roles}>
            <RequirePermission permission={group.permissions}>
                <StyledList disablePadding>
                    {showHeader && (
                        <StyledListSubheader disableGutters disableSticky>
                            {group.label.toUpperCase()}
                        </StyledListSubheader>
                    )}
                    {group.items.map((item) => (
                        <RequireRole key={item.id} role={item.roles}>
                            <RequirePermission permission={item.permissions}>
                                <NavigationItemComponent
                                    item={item}
                                    isActive={isItemActive(item)}
                                    isCompact={isCompact}
                                    onClose={onClose}
                                    isItemActive={isItemActive}
                                />
                            </RequirePermission>
                        </RequireRole>
                    ))}
                </StyledList>
            </RequirePermission>
        </RequireRole>
    );
}
