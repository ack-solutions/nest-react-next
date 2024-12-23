import { useState } from 'react';


export function useTabs(defaultValues?: string) {
    const [currentTab, setCurrentTab] = useState(defaultValues || '');

    return {
        currentTab,
        onChangeTab: (_event: React.SyntheticEvent<Element, Event>, newValue: any) => {
            setCurrentTab(newValue);
        },
        setCurrentTab,
    };
}
