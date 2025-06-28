import { IUser } from '@libs/types';
import { Avatar, Stack, StackProps, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';


export interface UserWithAvatarProps extends StackProps {
    user: IUser;
    secondaryText?: any;
    children?: ReactNode;
    hideName?: boolean
}

const character = (name: string) => name && name.charAt(0).toUpperCase();

function UserWithAvatar({
    user,
    secondaryText,
    children,
    hideName = false,
    ...props
}: UserWithAvatarProps) {
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
                {user?.name ? charAtName : null}
                {children}
            </Avatar>
            {!hideName ? (
                <Stack>
                    <Typography
                        variant="body2"
                        noWrap
                    >
                        {startCase(user?.name)}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                    >
                        {secondaryText}
                    </Typography>
                </Stack>
            ) : null}

        </Stack>
    );
}

export default UserWithAvatar;
