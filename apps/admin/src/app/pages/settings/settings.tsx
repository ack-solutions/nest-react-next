import { PermissionsEnum, RoleNameEnum } from '@libs/types';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { Page } from '../../components';
import { withRequirePermission, useHasRole } from '@ackplus/nest-auth-react';
import { PATH_DASHBOARD } from '../../routes/paths';
import GeneralSetting from '../../sections/setting/general-setting';
import DatabaseSeederSetting from '../../sections/setting/database-seeder-setting';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `settings-tab-${index}`,
        'aria-controls': `settings-tabpanel-${index}`,
    };
}

function Settings() {
    const [tabValue, setTabValue] = useState(0);
    const isSuperAdmin = useHasRole(RoleNameEnum.SUPER_ADMIN);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Page
            title="Settings"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Settings' },
            ]}
        >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
                    <Tab label="General" {...a11yProps(0)} />
                    {isSuperAdmin && <Tab label="Database Seeders" {...a11yProps(1)} />}
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <GeneralSetting />
            </TabPanel>

            {isSuperAdmin && (
                <TabPanel value={tabValue} index={1}>
                    <DatabaseSeederSetting />
                </TabPanel>
            )}
        </Page>
    );
}

export default withRequirePermission(Settings, {
    permission: PermissionsEnum.ACCESS_SETTINGS,
});
