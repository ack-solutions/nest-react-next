import { toDisplayDateRange } from '@libs/utils';
import { Box, Stack, Button, Divider, Chip } from '@mui/material';
import type { Theme, SxProps } from '@mui/material/styles';
import { isArray, startCase } from 'lodash';
import { useCallback } from 'react';

import { FiltersBlock } from '../filters-result/filters-block';
import { chipProps, FiltersResult } from '../filters-result/filters-result';
import { MenuDropdown } from '../menu-dropdown/menu-drop-down';


interface DataTableFiltersProps {
    sx?: SxProps<Theme>;
    filters: any;
    setFilterValues: (filters: any) => void;
    onClearSearch?: () => void;
}

export function DataTableFilters({
    filters,
    sx,
    setFilterValues,
    onClearSearch,
}: DataTableFiltersProps) {
    const handleRemoveFilter = useCallback((key: string) => {
        if (key === 'search' && onClearSearch) {
            onClearSearch();
            return;
        }
        const newFilters = { ...filters };
        delete newFilters[key];
        setFilterValues?.(newFilters);
    }, [
        filters,
        setFilterValues,
        onClearSearch,
    ]);

    const handleResetAll = useCallback(() => {
        if (onClearSearch) {
            onClearSearch();
        }
        setFilterValues?.({});
    }, [setFilterValues, onClearSearch]);

    const handleRemoveFilterItem = useCallback((key: string, itemToRemove: any) => {
        const currentValue = filters[key];
        if (isArray(currentValue)) {
            const newValue = currentValue.filter((item: any) => item !== itemToRemove);
            if (newValue.length > 0) {
                setFilterValues?.({
                    ...filters,
                    [key]: newValue,
                });
            } else {
                handleRemoveFilter(key);
            }
        } else {
            handleRemoveFilter(key);
        }
    }, [
        filters,
        setFilterValues,
        handleRemoveFilter,
    ]);

    const getDisplayValue = useCallback((key: string, value: any) => {
        switch (key) {
            case 'customer': return value.name;
            case 'dateRange': return toDisplayDateRange(value.startDate, value.endDate);
            case 'status': return isArray(value) ? value.map((v: any) => startCase(v)).join(', ') : startCase(value);
            case 'categories':
            case 'brands':
            case 'tags':
                return isArray(value) ? value.map((v: any) => v.name).join(', ') : value?.name;
            case 'search': return `"${value}"`;
            case 'isTrash': return 'Deleted Data';
            default: return value;
        }
    }, []);

    const renderFilterChips = useCallback((key: string, values: any[]) => {
        const chipList = values.slice(0, 2).map((value: any) => {
            return (
                <Chip
                    key={`${key}-chip-${value}`}
                    {...chipProps}
                    label={getDisplayValue(key, value)}
                    onDelete={() => handleRemoveFilterItem(key, value)}
                    sx={{
                        ...chipProps.sx,
                        '&:hover': {
                            boxShadow: 1,
                        },
                    }}
                />
            );
        });

        const extraCount = values.length - 2;

        return (
            <>
                {chipList}
                {extraCount > 0 && (
                    <MenuDropdown
                        anchor={(
                            <Chip
                                variant="outlined"
                                size="small"
                                label={`+${extraCount} more`}
                                sx={{
                                    '&:hover': {
                                        boxShadow: 1,
                                        backgroundColor: 'primary.light',
                                    },
                                }}
                            />
                        )}
                        slotProps={{
                            paper: {
                                elevation: 8,
                                sx: {
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                },
                            },
                        }}
                    >
                        {({ handleClose }) => (
                            <Box
                                sx={{
                                    p: 1,
                                    maxWidth: 150,
                                    minWidth: 80,
                                }}
                            >
                                <Stack gap={1}>
                                    {values.slice(2).map((value: any) => (
                                        <Chip
                                            key={`${key}-popover-chip`}
                                            {...chipProps}
                                            label={getDisplayValue(key, value)}
                                            onDelete={() => handleRemoveFilterItem(key, value)}
                                            sx={{
                                                ...chipProps.sx,
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                },
                                            }}
                                        />
                                    ))}
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Box
                                    sx={{
                                        textAlign: 'right',
                                    }}
                                >
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        onClick={() => {
                                            handleRemoveFilter(key);
                                            handleClose();
                                        }}
                                        sx={{
                                            borderRadius: 1.5,
                                            textTransform: 'none',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Clear All
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </MenuDropdown>
                )}
            </>
        );
    }, [
        getDisplayValue,
        handleRemoveFilterItem,
        handleRemoveFilter,
    ]);

    const renderFilterValue = useCallback((key: string, value: any) => {
        if (isArray(value)) {
            return (
                <Stack
                    direction="row"
                    gap={1}
                    flexWrap="wrap"
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    {renderFilterChips(key, value)}
                </Stack>
            );
        }

        return (
            <Chip
                variant="outlined"
                size="small"
                label={getDisplayValue(key, value)}
                onDelete={() => handleRemoveFilter(key)}
                sx={{
                    '&:hover': {
                        boxShadow: 1,
                    },
                }}
            />
        );
    }, [
        renderFilterChips,
        getDisplayValue,
        handleRemoveFilter,
    ]);

    // Don't render anything if no filters are applied
    const hasFilters = Object.keys(filters).some(key => filters[key]);
    if (!hasFilters) {
        return null;
    }

    return (
        <Box>
            <FiltersResult
                onReset={handleResetAll}
                sx={{
                    ...sx,
                    '& .MuiBox-root': {
                        gap: 1.5,
                    },
                }}
            >
                {Object.keys(filters).map((key) => {
                    const value = filters[key];
                    if (!value) return null;

                    return (
                        <FiltersBlock
                            key={key}
                            label={startCase(key)}
                            isShow={!!value}
                        >
                            {renderFilterValue(key, value)}
                        </FiltersBlock>
                    );
                })}
            </FiltersResult>
        </Box>
    );
}

export default DataTableFilters;
