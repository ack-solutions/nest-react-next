import { IUser, UserStatusEnum } from '@libs/types';

import UserStatusLabel from './user-status-label';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';
import { LabelDropdown } from '../label/label-dropdown';


interface UserStatusDropdownProps {
    user?: IUser;
    onChange: (newStatus: UserStatusEnum) => void;
}


function UserStatusDropdown({ user, onChange }: UserStatusDropdownProps) {
    return (
        <LabelDropdown
            selected={user?.status}
            options={Object.values(UserStatusEnum)}
            anchor={(
                <UserStatusLabel
                    label={user?.status}
                    endIcon={(
                        <Icon
                            icon={IconEnum.CARET_DOWN_FILL}
                            size={8}
                        />
                    )}
                    sx={{
                        cursor: 'pointer',
                    }}
                />
            )}
            renderOption={(option) => (
                <UserStatusLabel
                    label={option}
                    sx={{
                        cursor: 'pointer',
                        width: '100%',
                    }}
                />
            )}
            onChange={(option) => onChange(option)}
        />
    );
}

export default UserStatusDropdown;
