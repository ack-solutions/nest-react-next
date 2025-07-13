import { MenuItem } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';

import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';
import { Label, LabelProps, LabelColor } from './label/label';
import { MenuDropdown } from './menu-dropdown/menu-drop-down';


export interface StatusConfig {
    [key: string]: {
        color: LabelColor;
        variant?: 'filled' | 'outlined' | 'soft';
        label?: string;
    };
}

export interface StatusLabelProps extends Omit<LabelProps, 'color' | 'variant' | 'onChange' | 'ref'> {
    status: string;
    statusConfig?: StatusConfig;
    defaultColor?: LabelColor;
    defaultVariant?: 'filled' | 'outlined' | 'soft';
    // Dropdown functionality
    options?: string[];
    onChange?: (newStatus: string) => void;
    renderOption?: (option: string) => ReactNode;
}

// Status color mappings for different sections
export const STATUS_COLOR_MAPS = {
    // User status colors
    USER_STATUS_COLORS: {
        active: 'success' as const,
        inactive: 'error' as const,
        pending: 'warning' as const,
        suspended: 'error' as const,
        blocked: 'error' as const,
    },

    // Page status colors
    PAGE_STATUS_COLORS: {
        published: 'success' as const,
        draft: 'warning' as const,
        unpublished: 'error' as const,
        archived: 'default' as const,
    },

    // Template status colors
    TEMPLATE_STATUS_COLORS: {
        active: 'success' as const,
        inactive: 'error' as const,
        draft: 'warning' as const,
    },

    // General status colors
    GENERAL_STATUS_COLORS: {
        active: 'success' as const,
        inactive: 'error' as const,
        pending: 'warning' as const,
        completed: 'success' as const,
        cancelled: 'error' as const,
        processing: 'info' as const,
    },
} as const;

// Default status configurations for common use cases
export const DEFAULT_STATUS_CONFIGS = {
    // User status configuration
    user: {
        active: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.active,
            variant: 'filled' as const,
        },
        inactive: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.inactive,
            variant: 'filled' as const,
        },
        pending: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.pending,
            variant: 'filled' as const,
        },
        suspended: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.suspended,
            variant: 'filled' as const,
        },
        blocked: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.blocked,
            variant: 'filled' as const,
        },
    },

    // Page status configuration
    page: {
        published: {
            color: STATUS_COLOR_MAPS.PAGE_STATUS_COLORS.published,
            variant: 'filled' as const,
        },
        draft: {
            color: STATUS_COLOR_MAPS.PAGE_STATUS_COLORS.draft,
            variant: 'filled' as const,
        },
        unpublished: {
            color: STATUS_COLOR_MAPS.PAGE_STATUS_COLORS.unpublished,
            variant: 'filled' as const,
        },
        archived: {
            color: STATUS_COLOR_MAPS.PAGE_STATUS_COLORS.archived,
            variant: 'filled' as const,
        },
    },

    // Template status configuration
    template: {
        active: {
            color: STATUS_COLOR_MAPS.TEMPLATE_STATUS_COLORS.active,
            variant: 'filled' as const,
            label: 'Active',
        },
        inactive: {
            color: STATUS_COLOR_MAPS.TEMPLATE_STATUS_COLORS.inactive,
            variant: 'filled' as const,
            label: 'Inactive',
        },
        draft: {
            color: STATUS_COLOR_MAPS.TEMPLATE_STATUS_COLORS.draft,
            variant: 'filled' as const,
        },
    },

    // General status configuration
    general: {
        active: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.active,
            variant: 'filled' as const,
        },
        inactive: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.inactive,
            variant: 'filled' as const,
        },
        pending: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.pending,
            variant: 'filled' as const,
        },
        completed: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.completed,
            variant: 'filled' as const,
        },
        cancelled: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.cancelled,
            variant: 'filled' as const,
        },
        processing: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.processing,
            variant: 'filled' as const,
        },
    },
} as const;

export function StatusLabel({
    status,
    statusConfig,
    defaultColor = 'default',
    defaultVariant = 'soft',
    options,
    onChange,
    renderOption,
    ...props
}: StatusLabelProps) {
    if (!status) {
        return null;
    }

    const normalizedStatus = status.toLowerCase();
    const config = statusConfig?.[normalizedStatus];

    const labelColor = config?.color || defaultColor;
    const labelVariant = config?.variant || defaultVariant;
    const labelText = config?.label || startCase(status);

    // If no dropdown functionality is needed, return simple label
    if (!options || !onChange) {
        return (
            <Label
                color={labelColor}
                variant={labelVariant}
                {...props}
            >
                {labelText}
            </Label>
        );
    }

    // Return dropdown version
    return (
        <MenuDropdown
            anchor={(
                <Label
                    color={labelColor}
                    variant={labelVariant}
                    endIcon={(
                        <Icon
                            icon={IconEnum.ChevronDown}
                            size={8}
                        />
                    )}
                    sx={{
                        cursor: 'pointer',
                        ...props.sx,
                    }}
                    {...props}
                >
                    {labelText}
                </Label>
            )}
        >
            {({ handleClose }) => options.map((option) => {
                const optionNormalized = option.toLowerCase();
                const optionConfig = statusConfig?.[optionNormalized];
                const optionColor = optionConfig?.color || defaultColor;
                const optionVariant = optionConfig?.variant || defaultVariant;
                const optionLabel = optionConfig?.label || startCase(option);

                return (
                    <MenuItem
                        key={option}
                        selected={normalizedStatus === optionNormalized}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onChange(option);
                            handleClose();
                        }}
                        sx={{
                            justifyContent: 'center',
                        }}
                    >
                        {renderOption ? renderOption(option) : (
                            <Label
                                color={optionColor}
                                variant={optionVariant}
                                sx={{ minWidth: 'auto' }}
                            >
                                {optionLabel}
                            </Label>
                        )}
                    </MenuItem>
                );
            })}
        </MenuDropdown>
    );
}

// Helper functions for backward compatibility
export function getStatusConfig(type: keyof typeof DEFAULT_STATUS_CONFIGS): StatusConfig {
    return DEFAULT_STATUS_CONFIGS[type];
}

export function createStatusConfig(
    colorMap: Record<string, LabelColor>,
    variant: 'filled' | 'outlined' | 'soft' = 'filled',
): StatusConfig {
    return Object.entries(colorMap).reduce((acc, [key, color]) => {
        acc[key] = {
            color,
            variant,
        };
        return acc;
    }, {} as StatusConfig);
}
