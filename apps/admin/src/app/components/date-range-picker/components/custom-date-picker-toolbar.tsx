
import { Divider, Stack, Typography } from '@mui/material';
import { DatePickerToolbarProps } from '@mui/x-date-pickers';
import clsx from 'clsx';

import { Dayjs } from 'dayjs';
import { Datetime } from '@libs/utils';


export interface CustomDatePickerToolbarProps extends DatePickerToolbarProps {
    selectedDates?: Dayjs[];
}

export function CustomDatePickerToolbar({
    selectedDates,
    classes,
}: CustomDatePickerToolbarProps) {
    return (
        <Stack
            className={clsx(
                'MuiPickersToolbar-root',
                'MuiPickersLayout-toolbar',
                classes?.root,
            )}
            spacing={1}
        >
            <Stack
                direction="row"
                pt={1.5}
            >
                <Typography
                    className={clsx('MuiDatePickerToolbar-title')}
                    align="center"
                    variant="subtitle2"
                    color={
                        selectedDates && selectedDates[0] ?
                            'textPrimary' :
                            'textSecondary'
                    }
                    sx={{
                        fontWeight: 400,
                        width: '100%',
                        flexShrink: 1,
                    }}
                >
                    {selectedDates && selectedDates[0] ? Datetime.toDisplayDate(selectedDates[0], 'DD MMM YYYY') : 'Start Date'}
                    {' '}
                </Typography>
                <Divider
                    orientation="vertical"
                    flexItem
                />
                <Typography
                    className={clsx('MuiDatePickerToolbar-title')}
                    align="center"
                    variant="subtitle2"
                    color={
                        selectedDates && selectedDates[1] ?
                            'textPrimary' :
                            'textSecondary'
                    }
                    sx={{
                        fontWeight: 400,
                        width: '100%',
                        flexShrink: 1,
                    }}
                >

                    {selectedDates && selectedDates[1] ? Datetime.toDisplayDate(selectedDates[1], 'DD MMM YYYY') : 'End Date'}
                </Typography>
            </Stack>
            <Divider />
        </Stack>
    );
}
