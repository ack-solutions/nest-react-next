import { NavigationItem } from './navigation-config';
import NavigationLeafItem from './navigation-item-leaf';
import NavigationParentItem from './navigation-item-parent';

export interface NavigationItemComponentProps {
    item: NavigationItem;
    isActive: boolean;
    isCompact?: boolean;
    onClose?: () => void;
    isItemActive?: (item: NavigationItem) => boolean;
    depth?: number;
}

export default function NavigationItemComponent(props: NavigationItemComponentProps) {
    const hasChildren = Boolean(props.item.children?.length);

    if (hasChildren) {
        return <NavigationParentItem {...props} />;
    }

    return <NavigationLeafItem {...props} />;
}
