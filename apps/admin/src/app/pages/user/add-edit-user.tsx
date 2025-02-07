import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import Page from '@admin/app/components/page';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { useToasty, useUserQuery } from '@libs/react-core';
import { IRole, IUser } from '@libs/types';
import { Container } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AddEditUserForm from '../../sections/user/add-edit-user-form';


const AddEditUser = () => {
    const { id: userId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const { useUpdateUser, useCreateUser, useGetUserById } = useUserQuery();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: createUser } = useCreateUser();
    const { data: userData } = useGetUserById(userId, {
        relations: ['roles'],
    }, {
        select: (data) => {
            const rolesIds = data?.roles?.map((role: IRole) => role?.id);
            return {
                ...data,
                roles: rolesIds,
            };
        },
    });

    const handleSubmit = useCallback(
        (values: IUser) => {
            const options = {
                onSuccess: () => {
                    showToasty(
                        values?.id
                            ? 'User updated successfully'
                            : 'User added successfully',
                    );
                    navigate(PATH_DASHBOARD.users.root);
                },
                onError: (error) => {
                    showToasty(error, 'error');
                },
            };

            if (values?.id) {
                updateUser(values, options);
            } else {
                createUser(values, options);
            }
        },
        [
            createUser,
            navigate,
            showToasty,
            updateUser,
        ],
    );

    return (
        <Page title={`${userId ? 'Edit User' : 'Add User'}`}>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading={`${userId ? 'Edit User' : 'Add User'}`}
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: 'Users',
                            href: PATH_DASHBOARD.users.root,
                        },
                        { name: `${userId ? 'Edit User' : 'Add User'}` },
                    ]}
                />
                <AddEditUserForm
                    onSubmit={handleSubmit}
                    values={!!userData && userData}
                />
            </Container>
        </Page>
    );
};

export default AddEditUser;
