import { Stack, Tab, Tabs, TabsProps } from '@mui/material';
import Label from '../label/Label';
import { SyntheticEvent } from 'react';

interface ITab {
  value: string;
  label: string;
  count?: string;
  color?: string;
}

export interface DataTableTabProps extends Omit<TabsProps, 'onChange'> {
  tabs: ITab[];
  currentTab: string;
  onChange: (event: SyntheticEvent, tab: string) => void;
}

const DataTableTab= ({
  tabs,
  currentTab,
  onChange,
  ...props
}: DataTableTabProps) => {
  return (
    <Tabs
      {...props}
      variant="scrollable"
      scrollButtons="auto"
      value={currentTab}
      onChange={(event, tab) => onChange(event, tab)}
      sx={{ px: 2, bgcolor: 'background.neutral' }}
    >
      {tabs.map((tab) => (
        <Tab
          disableRipple
          key={tab.value}
          value={tab.value}
          label={
            <Stack spacing={1} direction="row" alignItems="center">
              <Label color={tab.color}> {tab.count} </Label>
              <div>{tab.label}</div>
            </Stack>
          }
        />
      ))}
    </Tabs>
  );
};

export default DataTableTab;
