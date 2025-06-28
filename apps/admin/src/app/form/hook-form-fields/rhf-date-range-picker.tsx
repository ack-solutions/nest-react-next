import moment from 'moment';
import { Control, useController } from 'react-hook-form';

import DateRangePickerDialog, { DateRangePickerDialogProps } from '../../components/date-range-picker/date-range-picker-dialog';


interface RHFDateRangePickerProps extends DateRangePickerDialogProps {
    control?: Control;
    name?: string;
}

function RHFDateRangePicker({ control, name = 'dateRange', ...props }: RHFDateRangePickerProps) {
    const {
        field,
        fieldState: { error },
    } = useController({
        name: name,
        control,
    });

    return (
        <DateRangePickerDialog
            range={field.value?.startDate && field.value?.endDate ? {
                startDate: moment(field.value.startDate),
                endDate: moment(field.value.endDate),
            } : {}}
            onChange={field.onChange}
            textFiledProps={{
                error: !!error,
            }}
            {...props}
        />
    );
}

export default RHFDateRangePicker;
