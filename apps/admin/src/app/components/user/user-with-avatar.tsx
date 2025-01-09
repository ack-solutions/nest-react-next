import { IUser } from '@libs/types';
import { Avatar, Stack, StackProps, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';


export interface UserWithAvatarProps extends StackProps {
  user: IUser;
  secondaryText?: any
  children?: ReactNode
}

const character = (name: string) => name && name.charAt(0).toUpperCase();

const UserWithAvatar = ({
    user,
    secondaryText,
    children,
    ...props
}: UserWithAvatarProps) => {
    const charAtName = character(user?.name);

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            {...props}
        >
            <Avatar
                src={user?.avatarUrl}
                alt={user?.name}
            >
                {user?.name && charAtName}
                {children}
            </Avatar>
            <Stack>
                <Typography variant="body2">{startCase(user?.name)}</Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >{secondaryText}</Typography>
            </Stack>
        </Stack>
    );
};

export default UserWithAvatar;
