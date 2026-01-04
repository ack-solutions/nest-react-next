import { useUser } from '@libs/react-shared';
import { IUser, PermissionsEnum } from '@libs/types';
import { Tab, Tabs } from '@mui/material';
import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Page, Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import PageLoading from '../../components/loading/page-loading';
import { withRequirePermission } from '@ackplus/nest-auth-react';
import { useTabs, useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditUserForm from '../../sections/user/add-edit-user-form';
import ChangePasswordForm from '../../sections/user/change-password-form';
import NotFound from '../error/not-found';


const userTabs = [
    {
        name: 'General',
        value: 'general',
        icon: <Icon icon={IconEnum.CircleUser} />,
    },
    {
        name: 'Reset Password',
        value: 'password',
        icon: <Icon icon={IconEnum.Key} />,
    },
];

function EditUser() {
    const { userId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const { useUpdateUser, useGetUserById } = useUser();
    const { mutateAsync: updateUser } = useUpdateUser();
    const { currentTab, onChangeTab } = useTabs('general');

    const { data: userData, isLoading, error } = useGetUserById(userId, {
        relations: ['authUser', 'authUser.roles'],
    });

    const handleSubmit = useCallback(
        async (values: IUser) => {
            if (values?.id) {
                if (values?.authUser?.roles?.length === 0) {
                    values.authUser.roles = null;
                }

                updateUser(values)
                    .then(() => {
                        showToasty('User updated successfully');
                        navigate(PATH_DASHBOARD.users.root);
                    })
                    .catch((error) => {
                        showToasty(error, 'error');
                    });
            }
        },
        [
            navigate,
            showToasty,
            updateUser,
        ],
    );

    if (isLoading) {
        return (
            <Page title="Loading...">
                <PageLoading />
            </Page>
        );
    }

    if (error) {
        return (
            <NotFound
                entityType="User"
                redirectPath={PATH_DASHBOARD.users.root}
            />
        );
    }

    return (
        <Page
            title={`${userData?.name}`}
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Users',
                    href: PATH_DASHBOARD.users.root,
                },
                { name: `${userData?.name}` },
            ]}
        >
            <Tabs
                value={currentTab}
                onChange={onChangeTab}
                sx={{ mb: 2 }}
            >
                {userTabs?.map((userTab) => (
                    <Tab
                        key={userTab?.value}
                        label={userTab?.name}
                        value={userTab?.value}
                        icon={userTab?.icon}
                        iconPosition="start"
                    />
                ))}
            </Tabs>

            {currentTab === 'general' && (
                <AddEditUserForm
                    onSubmit={handleSubmit}
                    values={!!userData && userData}
                />
            )}

            {currentTab === 'password' && <ChangePasswordForm />}
        </Page>
    );
}

export default withRequirePermission(EditUser, {
    permission: PermissionsEnum.UPDATE_USERS,
});
