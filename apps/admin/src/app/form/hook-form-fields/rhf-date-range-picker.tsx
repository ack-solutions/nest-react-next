import { Control, useController } from 'react-hook-form';

import { Datetime } from '@libs/utils';

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
                startDate: Datetime.toDayjs(field.value.startDate) ?? undefined,
                endDate: Datetime.toDayjs(field.value.endDate) ?? undefined,
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
