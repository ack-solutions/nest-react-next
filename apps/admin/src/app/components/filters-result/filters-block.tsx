import Box from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';
import { useMemo } from 'react';


export type FilterBlockProps = {
    label: string;
    isShow: boolean;
    sx?: SxProps<Theme>;
    children: React.ReactNode;
};

export function FiltersBlock({ label, children, isShow, sx }: FilterBlockProps) {
    const memoizedLabel = useMemo(() => {
        return label === 'Is Trash' ? '' : label;
    }, [label]);

    if (!isShow) {
        return null;
    }

    return (
        <Box
            gap={1}
            display="flex"
            sx={{
                p: 1,
                borderRadius: 1,
                overflow: 'hidden',
                border: (theme) => `dashed 1px ${theme.palette.divider}`,
                ...sx,
            }}
        >
            {memoizedLabel ? (
                <Box
                    component="span"
                    sx={{
                        height: 24,
                        lineHeight: '24px',
                        fontSize: (theme) => theme.typography.subtitle2.fontSize,
                        fontWeight: (theme) => theme.typography.subtitle2.fontWeight,
                    }}
                >
                    {memoizedLabel}
                    :
                </Box>
            ) : null}
            <Box
                gap={1}
                display="flex"
                flexWrap="wrap"
            >
                {children}
            </Box>
        </Box>
    );
}
