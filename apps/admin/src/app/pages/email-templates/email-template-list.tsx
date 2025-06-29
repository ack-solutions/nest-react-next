import { PermissionsEnum } from '@libs/types';

import { ComingSoon, Page } from '../../components';
import { withPermission } from '../../contexts/react-access-control';
import { PATH_DASHBOARD } from '../../routes/paths';


function EmailTemplateList() {
    return (
        <Page
            title="Email Templates"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Email Templates' },
            ]}
        >
            <ComingSoon />
        </Page>
    );
}

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_EMAIL_TEMPLATES],
})(EmailTemplateList);
