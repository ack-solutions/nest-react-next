import { PermissionsEnum } from '@libs/types';

import { Page } from '../../components';
import { withRequirePermission } from '@ackplus/nest-auth-react';
import { PATH_DASHBOARD } from '../../routes/paths';
import GeneralSetting from '../../sections/setting/general-setting';


function Settings() {
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
            <GeneralSetting />
        </Page>
    );
}

export default withRequirePermission(Settings, {
    permission: PermissionsEnum.ACCESS_SETTINGS,
});
