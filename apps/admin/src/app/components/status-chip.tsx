import { Chip, ChipProps } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';

import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';
import { MenuDropdown } from './menu-dropdown/menu-drop-down';


export interface StatusConfig {
    [key: string]: {
        color: ChipProps['color'];
        variant?: ChipProps['variant'];
        label?: string;
    };
}

export interface StatusChipProps extends Omit<ChipProps, 'color' | 'variant' | 'onChange'> {
    status: string;
    statusConfig?: StatusConfig;
    defaultColor?: ChipProps['color'];
    defaultVariant?: ChipProps['variant'];
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

// Default status configurations for common use cases (all filled by default)
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
            variant: 'filled' as const, // Changed from outlined to filled
        },
        blocked: {
            color: STATUS_COLOR_MAPS.USER_STATUS_COLORS.blocked,
            variant: 'filled' as const, // Changed from outlined to filled
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
            variant: 'filled' as const, // Changed from outlined to filled
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
            variant: 'filled' as const, // Changed from outlined to filled
        },
        processing: {
            color: STATUS_COLOR_MAPS.GENERAL_STATUS_COLORS.processing,
            variant: 'filled' as const,
        },
    },
} as const;

export function StatusChip({
    status,
    statusConfig,
    defaultColor = 'default',
    defaultVariant = 'filled', // Default to filled variant
    size = 'small',
    options,
    onChange,
    renderOption,
    ...props
}: StatusChipProps) {
    if (!status) {
        return null;
    }

    const normalizedStatus = status.toLowerCase();
    const config = statusConfig?.[normalizedStatus];

    const chipColor = config?.color || defaultColor;
    const chipVariant = config?.variant || defaultVariant;
    const chipLabel = config?.label || startCase(status);

    const chipElement = (
        <Chip
            label={chipLabel}
            color={chipColor}
            variant={chipVariant}
            size={size}
            {...props}
        />
    );

    // If dropdown functionality is needed
    if (options && onChange) {
        return (
            <MenuDropdown
                anchor={
                    <Chip
                        label={chipLabel}
                        color={chipColor}
                        variant={chipVariant}
                        size={size}
                        deleteIcon={(
                            <Icon
                                icon={IconEnum.ChevronDown}
                                size={8}
                            />
                        )}
                        onDelete={() => undefined} // Dummy function to show the delete icon
                        sx={{
                            cursor: 'pointer',
                            '& .MuiChip-deleteIcon': {
                                color: 'inherit',
                                '&:hover': {
                                    color: 'inherit',
                                },
                            },
                            ...props.sx,
                        }}
                        {...props}
                    />
                }
            >
                {({ handleClose }) => options.map((option) => {
                    const optionNormalized = option.toLowerCase();
                    const optionConfig = statusConfig?.[optionNormalized];
                    const optionColor = optionConfig?.color || defaultColor;
                    const optionVariant = optionConfig?.variant || defaultVariant;
                    const optionLabel = optionConfig?.label || startCase(option);

                    return (
                        <div
                            key={option}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onChange(option);
                                handleClose();
                            }}
                            style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {renderOption ? renderOption(option) : (
                                <Chip
                                    label={optionLabel}
                                    color={optionColor}
                                    variant={optionVariant}
                                    size={size}
                                    sx={{
                                        cursor: 'pointer',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}
                                />
                            )}
                        </div>
                    );
                })
                }
            </MenuDropdown>
        );
    }

    // Regular chip without dropdown
    return chipElement;
}

// Helper function to get status config by type
export function getStatusConfig(type: keyof typeof DEFAULT_STATUS_CONFIGS): StatusConfig {
    return DEFAULT_STATUS_CONFIGS[type];
}

// Helper function to create custom status config using color maps
export function createStatusConfig(
    colorMap: Record<string, ChipProps['color']>,
    variant: ChipProps['variant'] = 'filled',
): StatusConfig {
    const config: StatusConfig = {};

    Object.entries(colorMap).forEach(([status, color]) => {
        config[status] = {
            color,
            variant,
        };
    });

    return config;
}
