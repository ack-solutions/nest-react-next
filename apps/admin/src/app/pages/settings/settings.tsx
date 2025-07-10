import { PermissionsEnum } from '@libs/types';

import { Page } from '../../components';
import { withPermission } from '../../contexts/react-access-control';
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

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_SETTINGS],
})(Settings);
