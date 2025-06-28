import { Box, alpha } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import clsx from 'clsx';
import { Moment } from 'moment';
import { useCallback, useMemo } from 'react';


export interface CustomDayProps
    extends Omit<PickersDayProps, 'onMouseEnter' | 'onMouseOut'> {
    hoverDay?: Moment;
    selectedDates?: Moment[];
    onMouseEnter?: (date?: Moment) => void;
    onMouseOut?: (date?: Moment) => void;
}

function normalizeDate(date: Moment | undefined) {
    return date ? date.clone().startOf('day') : null;
}

export function CustomDay({
    selectedDates,
    day,
    hoverDay,
    outsideCurrentMonth,
    onClick,
    onMouseEnter,
    onMouseOut,
    ...props
}: CustomDayProps) {
    const { start, end } = useMemo(() => {
        const start = normalizeDate(selectedDates?.[0]);
        const end = normalizeDate(selectedDates?.[1]);

        return {
            start,
            end,
        };
    }, [selectedDates]);

    const dayIsBetween = useMemo(() => {
        return !outsideCurrentMonth && start && end && day.isAfter(start) && day.isBefore(end);
    }, [
        day,
        end,
        outsideCurrentMonth,
        start,
    ]);

    const isFirstDay = useMemo(() => {
        return !outsideCurrentMonth && start && day.isSame(start, 'day');
    }, [
        day,
        outsideCurrentMonth,
        start,
    ]);

    const isLastDay = useMemo(() => {
        return !outsideCurrentMonth && end && day.isSame(end, 'day');
    }, [
        day,
        end,
        outsideCurrentMonth,
    ]);

    const isOneDaySelected = useMemo(() => {
        return (
            !outsideCurrentMonth &&
            start &&
            day.isSame(start, 'day') &&
            (!end || start.isSame(end, 'day'))
        );
    }, [
        day,
        end,
        outsideCurrentMonth,
        start,
    ]);

    const selected = useMemo(() => {
        return (
            !outsideCurrentMonth &&
            (day.isSame(start, 'day') || day.isSame(end, 'day'))
        );
    }, [
        day,
        outsideCurrentMonth,
        start,
        end,
    ]);

    const handleOnClick = useCallback(() => {
        if (onClick) {
            onClick(day as any);
        }
    }, [day, onClick]);

    const handleHoverIn = useCallback(
        (_event) => {
            if (onMouseEnter) {
                onMouseEnter(day);
            }
        },
        [day, onMouseEnter],
    );

    const handleHoverOut = useCallback(
        (_event) => {
            if (onMouseOut) {
                onMouseOut(day);
            }
        },
        [day, onMouseOut],
    );

    return (
        <Box
            onMouseEnter={handleHoverIn}
            onMouseOut={handleHoverOut}
            sx={{
                ...(!isOneDaySelected && isFirstDay
                    ? {
                        borderRadius: '50% 0px 0px 50%',
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }
                    : {}),
                ...(!isOneDaySelected && dayIsBetween
                    ? {
                        borderRadius: 0,
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }
                    : {}),
                ...(!isOneDaySelected && isLastDay
                    ? {
                        borderRadius: '0px 50% 50% 0px',
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    }
                    : {}),
            }}
        >
            <Box border="2px solid transparent">
                <PickersDay
                    {...(props as any)}
                    onClick={handleOnClick}
                    disableMargin
                    outsideCurrentMonth={outsideCurrentMonth}
                    day={day}
                    selected={selected}
                    className={clsx(props.className)}
                    sx={{
                        ...props.sx,
                    }}
                />
            </Box>
        </Box>
    );
}
