import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import Image from '../../../components/image';


export const StyledBgFlag = styled(Box)<BoxProps>(({ theme }) => ({
    width: 24,
    height: 24,
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    backgroundColor: theme.palette.grey[100],
    position: 'relative',
}));

export function FlagImage({ iso }: { iso?: string }) {
    return (
        <StyledBgFlag component="span">
            <Image
                alt={`${iso} flag`}
                src={`/assets/flag-icons/${iso?.toLowerCase()}.webp`}
                sx={{
                    width: 1,
                    height: 1,
                    objectFit: 'cover',
                    borderRadius: 0.25,
                }}
            />
        </StyledBgFlag>
    );
}
