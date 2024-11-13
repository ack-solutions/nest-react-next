import { Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import AddEditUserForm from '../../sections/user/add-edit-user-form'
import { IRole, IUser } from '@libs/types'
import { useNavigate, useParams } from 'react-router-dom'
import { UserService, useToasty } from '@libs/react-core'
import { FormikHelpers } from 'formik'
import Page from '@admin/app/components/page'
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'

const userService = UserService.getInstance<UserService>();

const AddEditUser = () => {
    const { id: userId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>({});

    const handleSubmit = useCallback(
        (value?: IUser, action?: FormikHelpers<any>) => {
            if (value?.id) {
                userService.update(value?.id, value).then((resp) => {
                    showToasty('User Successfully Updated')
                    action?.setSubmitting(false)
                    navigate(PATH_DASHBOARD.users.root)
                }).catch((error => {
                    showToasty(error, 'error')
                }))
            } else {
                userService.create(value).then((resp) => {
                    showToasty('User Successfully Added')
                    action?.setSubmitting(false)
                    navigate(PATH_DASHBOARD.users.root)
                }).catch((error => {
                    showToasty(error, 'error')
                }))
            }
        },
        [],
    )

    useEffect(() => {
        if (userId) {
            userService
                .getOne(userId, {
                    relations: ['roles'],
                })
                .then((data) => {
                    const rolesIds = data?.roles?.map((role: IRole) => role?.id)
                    setUser({ ...data, roles: rolesIds });
                })
                .catch((error) => { });
        }
    }, [userId]);

    return (
        <Page title={`${userId ? 'Edit User' : 'Add User'}`}>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Users"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Users', href: PATH_DASHBOARD.users.root },
                        { name: `${userId ? 'Edit User' : 'Add User'}` },
                    ]}
                />
                <AddEditUserForm onSubmit={handleSubmit} values={user} />
            </Container>
        </Page>
    )
}

export default AddEditUser