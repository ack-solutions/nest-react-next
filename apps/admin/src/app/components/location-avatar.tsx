import { alpha, SxProps } from '@mui/material';
import { styled } from '@mui/system';

import Image from './image';


interface LocationAvatarProps {
    src?: string;
    size?: number;
    sxIconProps?: SxProps
}

const StyledLocationAvatar = styled(Image)<{ size?: number }>(({ theme, size }) => ({
    width: size || 42,
    height: size || 42,
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.grey[500], 0.5),
}));

function LocationAvatar({ src, size, sxIconProps }: LocationAvatarProps) {
    return (

        <StyledLocationAvatar
            src={src}
            alt="Location Avatar"
            width={size}
            height={size}
            type="location"
            objectFit="contain"
            sx={{
                ...sxIconProps,
            }}
        />


    );
}

export default LocationAvatar;
