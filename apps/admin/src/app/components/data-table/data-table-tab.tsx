import { Stack, Tab, Tabs, TabsProps } from '@mui/material';
import { SyntheticEvent } from 'react';

import { Label } from '../label';


export interface DataTableTabItem {
    value: string;
    label: string;
    count?: number | string;
    color?: string;
}

export interface DataTableTabProps extends Omit<TabsProps, 'onChange'> {
    tabs: DataTableTabItem[];
    onChange: (tab: string, event: SyntheticEvent) => void;
}

export function DataTableTab({
    tabs,
    onChange,
    ...props
}: DataTableTabProps) {
    return (
        <Tabs
            variant="scrollable"
            scrollButtons="auto"
            onChange={(event, tab) => onChange && onChange(tab, event)}
            sx={{
                px: 2,
            }}
            {...props}
        >
            {tabs?.map((tab: any) => (
                <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    label={(
                        <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                        >
                            <Label color={tab.color}>
                                {' '}
                                {tab.count}
                                {' '}
                            </Label>
                            <div>{tab.label}</div>
                        </Stack>
                    )}
                />
            ))}
        </Tabs>
    );
}
