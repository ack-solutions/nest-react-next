import { PermissionsEnum } from '@libs/types';

import { ComingSoon, Page } from '../../components';
import { withPermission } from '../../contexts/react-access-control';
import { PATH_DASHBOARD } from '../../routes/paths';


function SettingsList() {
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
            <ComingSoon />
        </Page>
    );
}

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_SETTINGS],
})(SettingsList);
