import { useMemo } from 'react';
import { startCase } from 'lodash';
import { useTheme } from '@mui/material';
import { Label, LabelColor, LabelProps } from './label';

export interface StatusLabelProps extends LabelProps {
    label?: string;
}

const StatusLabel = ({
    label,
    ...props
}: StatusLabelProps) => {
    const theme = useTheme()

    const color: LabelColor = useMemo(() => {
        switch (label) {
            case 'pending':
                return 'warning'

            case 'hold':
                return 'warning'

            case 'overdue':
                return 'error'

            case 'completed':
                return 'success'

            case 'rejected':
                return 'error'

            case 'approved':
                return 'success'

            case 'decline':
                return 'error'

            case 'draft':
                return 'info'

            case 'published':
                return 'success'

            case 'unpublished':
                return 'error'

            default:
                return 'default'
        }
    }, [theme, label])

    return (
        <Label className='status-label' color={color} >
            {startCase(label)}
        </Label>
    );
}

export default StatusLabel;
