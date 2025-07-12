import { IUser, UserStatusEnum } from '@libs/types';

import { StatusChip, getStatusConfig } from '../status-chip';


interface UserStatusDropdownProps {
    user?: IUser;
    onChange: (newStatus: UserStatusEnum) => void;
}


function UserStatusDropdown({ user, onChange }: UserStatusDropdownProps) {
    const userStatusOptions = Object.values(UserStatusEnum);
    const userStatusConfig = getStatusConfig('user');

    return (
        <StatusChip
            status={user?.status || UserStatusEnum.PENDING}
            statusConfig={userStatusConfig}
            options={userStatusOptions}
            onChange={(newStatus) => onChange(newStatus as UserStatusEnum)}
        />
    );
}

export default UserStatusDropdown;
