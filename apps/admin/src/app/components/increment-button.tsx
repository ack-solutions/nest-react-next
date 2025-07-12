import { alpha, InputBase, IconButton, Stack, SxProps } from '@mui/material';
import { ChangeEvent } from 'react';

import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';


interface IncrementButtonProps {
    name?: string;
    quantity: number;
    disabledIncrease?: boolean;
    disabledDecrease?: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
    onChange?: (value: number) => void;
    sx?: SxProps;
}

function IncrementButton({
    quantity,
    onIncrease,
    onDecrease,
    disabledIncrease,
    disabledDecrease,
    onChange,
    sx,
    ...other
}: IncrementButtonProps) {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (!isNaN(value) && onChange) {
            onChange(value);
        }
    };

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                minWidth: 100,
                borderRadius: 1,
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
                ...sx,
            }}
            {...other}
        >
            <IconButton
                onClick={onDecrease}
                disabled={disabledDecrease}
                sx={{ borderRadius: 0.75 }}
                disableRipple
            >
                <Icon icon={IconEnum.CircleMinus} />
            </IconButton>
            <InputBase
                value={quantity}
                onChange={handleInputChange}
                slotProps={{
                    input: {
                        sx: {
                            typography: 'subtitle2',
                            mx: 0.5,
                            textAlign: 'center',
                            width: 60,
                            backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
                            py: 1,
                            minHeight: 22,
                        },
                    },
                }}
            />
            <IconButton
                onClick={onIncrease}
                disabled={disabledIncrease}
                sx={{ borderRadius: 0.75 }}
                disableRipple
            >
                <Icon icon={IconEnum.CirclePlus} />
            </IconButton>
        </Stack>
    );
}

export default IncrementButton;
