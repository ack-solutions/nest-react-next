import { Container } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import AddEditUserForm from '../../sections/user/add-edit-user-form'
import { IUser } from '@mlm/types'
import { useNavigate, useParams } from 'react-router-dom'
import { UserService, useToasty } from '@mlm/react-core'
import { FormikHelpers } from 'formik'

const userService = UserService.getInstance<UserService>();

const AddEditUser = () => {
    const { id: userId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>({});

    const handleSubmit = useCallback(
        (value?: IUser, action?: FormikHelpers<any>) => {
            console.log(value);
            if (value?.id) {
                userService.update(value?.id, value).then((resp) => {
                    console.log(resp);
                    showToasty('User Successfully Updated')
                }).catch((error => {
                    showToasty(error, 'error')
                }))
            } else {
                userService.create(value).then((resp) => {
                    console.log(resp);
                    showToasty('User Successfully Added')
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
                    setUser(data.data);
                })
                .catch((error) => { });
        }
    }, [userId]);
    return (
        <Container maxWidth={false}>
            <AddEditUserForm onSubmit={handleSubmit} values={user} />
        </Container>
    )
}

export default AddEditUser