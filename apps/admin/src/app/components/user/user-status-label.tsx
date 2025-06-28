import { UserStatusEnum } from '@libs/types';
import { startCase } from 'lodash';
import { useMemo } from 'react';

import { Label, LabelColor, LabelProps } from '../label';


export interface UserStatusLabelProps extends Omit<LabelProps, 'ref'> {
    label?: string;
}

function UserStatusLabel({ label, ...labelProps }: UserStatusLabelProps) {
    const color: LabelColor = useMemo(() => {
        switch (label) {
            case UserStatusEnum.ACTIVE:
                return 'success';

            case UserStatusEnum.INACTIVE:
                return 'error';

            case UserStatusEnum.PENDING:
                return 'warning';

            default:
                return 'default';
        }
    }, [label]);

    return (
        <Label
            className="status-label"
            color={color}
            {...labelProps}
        >
            {startCase(label)}
        </Label>
    );
}

export default UserStatusLabel;
