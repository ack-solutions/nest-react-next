import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import { useMemo } from 'react';

function stringAvatar(name?: string) {
    const namePars = name?.split(' ') || [];
    return {
        children: `${namePars[0] && namePars[0][0]}${namePars[1] ? namePars[1][0] : ''}`,
    };
}


export interface AvatarProps extends MuiAvatarProps {
	size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
}

export default function Avatar({ sx, size = 'medium', ...props }: AvatarProps) {

    const sizeSx = useMemo(() => {
        let width = 40;
        let height = 40;
        let fontSize = 18;
        switch (size) {
        case 'x-small':
            width = 20;
            height = 20;
            fontSize = 8;
            break;

        case 'small':
            width = 24;
            height = 24;
            fontSize = 10;
            break;

        case 'medium':
            width = 32;
            height = 32;
            fontSize = 16;
            break;

        case 'large':
            width = 40;
            height = 40;
            fontSize = 20;
            break;

        case 'x-large':
            width = 48;
            height = 48;
            fontSize = 24;
            break;

        default:
            break;
        }

        return {
            width,
            height,
            fontSize,
        }
    }, [size]);

    return (
        <MuiAvatar
            sx={{
                ...sizeSx,
                ...sx
            }}
            {...stringAvatar(props.alt)}
            {...props}
        />

    );
}
