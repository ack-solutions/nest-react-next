import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { ChipProps } from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export const chipProps: ChipProps = {
    size: 'small',
    variant: 'outlined',
    onClick: undefined,
};

type FiltersResultProps = {
    onReset: () => void;
    sx?: SxProps<Theme>;
    children: React.ReactNode;
};

export function FiltersResult({ onReset, sx, children }: FiltersResultProps) {
    return (
        <Box sx={sx}>
            <Box
                flexGrow={1}
                gap={1}
                display="flex"
                flexWrap="wrap"
                alignItems="center"
            >
                {children}

                <Button
                    color="error"
                    onClick={onReset}
                    startIcon={<Icon icon={IconEnum.Trash} />}
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
}
