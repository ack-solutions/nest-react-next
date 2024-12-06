import { useMemo } from 'react';
import { startCase } from 'lodash';
import { Label, LabelColor, LabelProps } from '@libs/react-core';
import { UserStatusEnum } from '@libs/types';

export interface UserStatusLabelProps extends LabelProps {
    label?: string;
}

const UserStatusLabel = ({ label }: UserStatusLabelProps) => {

    const color: LabelColor = useMemo(() => {
        switch (label) {

            case UserStatusEnum.ACTIVE:
                return 'primary'

            case UserStatusEnum.INACTIVE:
                return 'error'

            case UserStatusEnum.PENDING:
                return 'warning'

            default:
                return 'secondary'
        }
    }, [label])

    return (
        <Label className='status-label' color={color}>
            {startCase(label)}
        </Label>
    );

}

export default UserStatusLabel
