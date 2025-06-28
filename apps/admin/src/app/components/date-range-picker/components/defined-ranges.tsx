import { List, ListItemButton, ListItemText } from '@mui/material';

import { DateRange, DefinedRange } from '../types';


type DefinedRangesProps = {
    setRange: (range: DateRange) => void;
    selectedRange: DateRange;
    ranges: DefinedRange[];
};

const isSameRange = (first: DateRange, second: DateRange) => {
    const { startDate: fStart, endDate: fEnd } = first;
    const { startDate: sStart, endDate: sEnd } = second;
    if (fStart && sStart && fEnd && sEnd) {
        return fStart.isSame(sStart, 'day') && fEnd.isSame(sEnd, 'day');
    }
    if (!fStart && !fEnd && !sStart && !sEnd) {
        return true;
    }
    return false;
};

function DefinedRanges({
    ranges,
    setRange,
    selectedRange,
}: DefinedRangesProps) {
    return (
        <List>
            {ranges.map((range) => (
                <ListItemButton
                    key={range.label}
                    onClick={() => setRange(range)}
                    sx={[
                        isSameRange(range, selectedRange) && {
                            backgroundColor: (theme) => theme.palette.primary.dark,
                            color: 'primary.contrastText',
                            '&:hover': {
                                color: 'inherit',
                            },
                        },
                    ]}
                >
                    <ListItemText
                        slotProps={{
                            primary: {
                                variant: 'body2',
                                sx: {
                                    fontWeight: isSameRange(range, selectedRange) ?
                                        'bold' :
                                        'normal',
                                },
                            },
                        }}
                    >
                        {range.label}
                    </ListItemText>
                </ListItemButton>
            ))}
        </List>
    );
}

export default DefinedRanges;
