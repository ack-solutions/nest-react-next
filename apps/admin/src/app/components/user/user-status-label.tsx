import { IUser, UserStatusEnum } from '@libs/types';

import { StatusLabel, getStatusConfig } from '../status-label';


interface UserStatusLabelProps {
    user?: IUser;
    onChange?: (newStatus: UserStatusEnum) => void;
    // Additional props that StatusLabel supports
    variant?: 'filled' | 'outlined' | 'soft';
}


function UserStatusLabel({
    user,
    onChange,
    variant = 'filled',
}: UserStatusLabelProps) {
    const userStatusOptions = Object.values(UserStatusEnum);
    const userStatusConfig = getStatusConfig('user');

    return (
        <StatusLabel
            status={user?.status || UserStatusEnum.PENDING}
            statusConfig={userStatusConfig}
            defaultVariant={variant}
            options={onChange ? userStatusOptions : undefined}
            onChange={onChange ? (newStatus) => onChange(newStatus as UserStatusEnum) : undefined}
        />
    );
}

export default UserStatusLabel;
