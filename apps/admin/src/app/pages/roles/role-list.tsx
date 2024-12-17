import { useCallback } from 'react';
import {
    Container,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IRole } from '@libs/types';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import RoleListTable from '@admin/app/sections/role/role-list-table';

export default function RoleList() {
    const navigate = useNavigate();
    const handleOpenEditRole = useCallback(
        (row: IRole) => {
            navigate(`${PATH_DASHBOARD.users.editRole}/${row?.id}`)
        },
        [],
    )

    return (
        <Page title='Roles'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Roles"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Roles', href: PATH_DASHBOARD.users.roles },
                        { name: 'List' },
                    ]}
                    action={
                        <Button
                            variant='contained'
                            onClick={() => navigate(PATH_DASHBOARD.users.addRole)}
                        >
                            Add Role
                        </Button>
                    }
                />
                <RoleListTable onEdit={handleOpenEditRole} />
            </Container>
        </Page>
    );
}
