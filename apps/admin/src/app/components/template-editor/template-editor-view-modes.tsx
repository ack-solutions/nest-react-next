import { ToggleButton, ToggleButtonGroup, Tooltip, Box } from '@mui/material';
import { useState } from 'react';

import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export type ViewMode = 'code' | 'preview' | 'split';

export interface TemplateEditorViewModesProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    disabled?: boolean;
}

export function TemplateEditorViewModes({
    viewMode,
    onViewModeChange,
    disabled = false,
}: TemplateEditorViewModesProps) {
    const handleViewModeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newMode: ViewMode | null,
    ) => {
        if (newMode !== null) {
            onViewModeChange(newMode);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                disabled={disabled}
                sx={{
                    '& .MuiToggleButton-root': {
                        border: 1,
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        },
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    },
                }}
            >
                <ToggleButton value="code" aria-label="code view">
                    <Tooltip title="Code View">
                        <Icon icon={IconEnum.Code} size={16} />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton value="split" aria-label="split view">
                    <Tooltip title="Split View">
                        <Icon icon={IconEnum.Split} size={16} />
                    </Tooltip>
                </ToggleButton>

                <ToggleButton value="preview" aria-label="preview view">
                    <Tooltip title="Preview View">
                        <Icon icon={IconEnum.Eye} size={16} />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
