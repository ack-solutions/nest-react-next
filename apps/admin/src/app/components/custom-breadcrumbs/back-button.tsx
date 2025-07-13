import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export function BackButton() {
    const navigate = useNavigate();
    const canGoBack = window.history.length > 1;

    return (
        canGoBack ? (
            <IconButton
                onClick={() => navigate(-1)}
                size="small"
                sx={{
                    bgcolor: 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                }}
            >
                <Icon
                    size="small"
                    icon={IconEnum.ArrowLeft}
                />
            </IconButton>
        ) : null
    );
}
