import { useUser } from '@libs/react-shared';
import { IUser, PermissionsEnum } from '@libs/types';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '../../components';
import { withRequirePermission } from '@ackplus/nest-auth-react';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditUserForm from '../../sections/user/add-edit-user-form';


function AddUser() {
    const { showToasty } = useToasty();
    const { useCreateUser } = useUser();
    const navigate = useNavigate();
    const { mutateAsync: createUser } = useCreateUser();

    const handleSubmit = useCallback(
        async (values: IUser) => {
            createUser(values).then(() => {
                showToasty('User added successfully');
                navigate(PATH_DASHBOARD.users.root);
            }).catch((error) => {
                showToasty(error, 'error');
            });
        },
        [
            createUser,
            navigate,
            showToasty,
        ],
    );

    return (
        <Page
            title="Add User"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Users',
                    href: PATH_DASHBOARD.users.root,
                },
                { name: 'Add User' },
            ]}
        >
            <AddEditUserForm onSubmit={handleSubmit} />
        </Page>
    );
}

export default withRequirePermission(AddUser, {
    permission: PermissionsEnum.CREATE_USERS,
});
