import { PermissionsEnum } from '@libs/types';

import { ComingSoon, Page } from '../../components';
import { withPermission } from '../../contexts/react-access-control';
import { PATH_DASHBOARD } from '../../routes/paths';


function PageList() {
    return (
        <Page
            title="Pages"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Pages' },
            ]}
        >
            <ComingSoon />
        </Page>
    );
}

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_PAGES],
})(PageList);
