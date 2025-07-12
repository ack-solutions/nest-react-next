import { useCountry } from '@libs/react-shared';
import { ICountry } from '@libs/types';
import { CircularProgress, InputAdornment, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { useState, useMemo, useRef } from 'react';
import { Country } from 'react-phone-number-input';

import { FlagImage } from './flag-image';
import { Icon } from '../../../components/icons/icon';
import { IconEnum } from '../../../components/icons/icons';
import { MenuDropdown } from '../../../components/menu-dropdown';
import { SearchNotFound } from '../../../components/search-not-found';
import { useBoolean } from '../../../hook/use-boolean';
import { TextFieldRaw } from '../text-field-raw';


export interface CountryListProps {
    isoCode?: Country;
    onClickCountry: (iso: Country, code: string) => void;
}

export function CountryListPopover({ isoCode, onClickCountry }: CountryListProps) {
    const { useSearchCountry } = useCountry();
    const [searchValue, setSearchValue] = useState('');
    const isTyping = useBoolean();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { data: countries, isLoading } = useSearchCountry();

    const selectedCountry = useMemo(() => {
        if (!isoCode || !countries || countries?.length === 0) {
            return null;
        }
        return countries?.find((country) => country.iso === isoCode) as ICountry;
    }, [countries, isoCode]);

    const dataFiltered = useMemo(() => {
        if (!countries || countries?.length === 0) {
            return {
                priorityCountries: [],
                otherCountries: [],
            };
        }

        const filtered = countries.filter((country) => {
            return country.country.toLowerCase().includes(searchValue.toLowerCase()) ||
                country.code.toLowerCase().includes(searchValue.toLowerCase()) ||
                country.iso.toLowerCase().includes(searchValue.toLowerCase());
        });

        // Priority countries: India (IN) and United States (US)
        const priorityIso = ['IN', 'US'];
        const priorityCountries = [];
        const otherCountries = [];

        // If no search, show priority countries first
        if (!searchValue) {
            priorityIso.forEach(iso => {
                const country = filtered.find(c => c.iso === iso);
                if (country) {
                    priorityCountries.push(country);
                }
            });

            // Add remaining countries
            filtered.forEach(country => {
                if (!priorityIso.includes(country.iso)) {
                    otherCountries.push(country);
                }
            });
        } else {
            // If searching, just return filtered results
            otherCountries.push(...filtered);
        }

        return {
            priorityCountries,
            otherCountries,
        };
    }, [countries, searchValue]);

    // Reset search when dropdown closes
    const handleMenuClose = () => {
        setSearchValue('');
        isTyping.onFalse();
    };

    return (
        <MenuDropdown
            anchor={(
                <ButtonBase
                    disableRipple
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1,
                        py: 2,
                        minWidth: 'auto',
                        '&:hover': {
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                        },
                    }}
                >
                    <FlagImage iso={selectedCountry?.iso} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                        }}
                    >
                        +
                        {selectedCountry?.code || '+91'}
                    </Typography>

                    <Icon
                        icon={IconEnum.ChevronDown}
                        size={12}
                        sx={{
                            color: 'text.disabled',
                        }}
                    />
                </ButtonBase>
            )}
        >
            {({ handleClose }) => {
                const handleCloseAndReset = () => {
                    handleClose();
                    handleMenuClose();
                };

                return (
                    <Box
                        sx={{ minWidth: 280 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            sx={{
                                px: 2,
                                py: 1.5,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <TextFieldRaw
                                inputRef={searchInputRef}
                                autoFocus
                                fullWidth
                                size="small"
                                type="search"
                                value={searchValue}
                                onChange={(event) => {
                                    event.stopPropagation();
                                    setSearchValue(event.target.value);
                                }}
                                onFocus={(event) => {
                                    event.stopPropagation();
                                    isTyping.onTrue();
                                }}
                                onBlur={(event) => {
                                    event.stopPropagation();
                                    isTyping.onFalse();
                                }}
                                onKeyDown={(event) => {
                                    // Prevent event bubbling to parent components
                                    // event.stopPropagation();

                                    // Handle escape key to close dropdown
                                    if (event.key === 'Escape') {
                                        handleCloseAndReset();
                                    }
                                }}
                                // onClick={(event) => {
                                //     event.stopPropagation();
                                // }}
                                placeholder="Search country..."
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon
                                                    icon={IconEnum.Search}
                                                    sx={{ color: 'text.disabled' }}
                                                />
                                            </InputAdornment>
                                        ),
                                        onKeyDown: (event) => {
                                            event.stopPropagation();
                                        },
                                        onClick: (event) => {
                                            event.stopPropagation();
                                        },
                                    },
                                }}
                            />
                        </Box>

                        {isLoading ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    py: 4,
                                }}
                            >
                                <CircularProgress size={24} />
                            </Box>
                        ) : null}

                        <Box
                            sx={{
                                maxHeight: 360,
                                overflowY: 'auto',
                            }}
                        >
                            {(dataFiltered.priorityCountries.length === 0 && dataFiltered.otherCountries.length === 0 && searchValue && !isLoading) ? (
                                <SearchNotFound
                                    query={searchValue}
                                    sx={{
                                        px: 2,
                                        py: 3,
                                    }}
                                />
                            ) : (
                                <MenuList
                                    dense
                                    disablePadding
                                >
                                    {/* Priority Countries */}
                                    {dataFiltered.priorityCountries.map((country) => {
                                        if (!country.iso) {
                                            return null;
                                        }

                                        return (
                                            <MenuItem
                                                key={country.iso}
                                                selected={isoCode === country.iso}
                                                autoFocus={isoCode === country.iso && !isTyping.value}
                                                onClick={() => {
                                                    handleCloseAndReset();
                                                    onClickCountry?.(country.iso as Country, country.code ? `+${country.code}` : '');
                                                }}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    minHeight: 'auto',
                                                }}
                                            >
                                                <FlagImage iso={country.iso} />
                                                <ListItemText
                                                    sx={{ ml: 1.5 }}
                                                    primary={country.country}
                                                    secondary={`${country.iso} (+${country.code})`}
                                                    slotProps={{
                                                        primary: {
                                                            noWrap: true,
                                                            typography: 'body2',
                                                        },
                                                        secondary: {
                                                            typography: 'caption',
                                                            color: 'text.secondary',
                                                        },
                                                    }}
                                                />
                                            </MenuItem>
                                        );
                                    })}

                                    {/* Divider between priority and other countries */}
                                    {dataFiltered.priorityCountries.length > 0 && dataFiltered.otherCountries.length > 0 && (
                                        <Divider sx={{ my: 0.5 }} />
                                    )}

                                    {/* Other Countries */}
                                    {dataFiltered.otherCountries.map((country) => {
                                        if (!country.iso) {
                                            return null;
                                        }

                                        return (
                                            <MenuItem
                                                key={country.iso}
                                                selected={isoCode === country.iso}
                                                autoFocus={isoCode === country.iso && !isTyping.value}
                                                onClick={() => {
                                                    handleCloseAndReset();
                                                    onClickCountry?.(country.iso as Country, country.code ? `+${country.code}` : '');
                                                }}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2,
                                                    minHeight: 'auto',
                                                }}
                                            >
                                                <FlagImage iso={country.iso} />
                                                <ListItemText
                                                    sx={{ ml: 1.5 }}
                                                    primary={country.country}
                                                    secondary={`${country.iso} (+${country.code})`}
                                                    slotProps={{
                                                        primary: {
                                                            noWrap: true,
                                                            typography: 'body2',
                                                        },
                                                        secondary: {
                                                            typography: 'caption',
                                                            color: 'text.secondary',
                                                        },
                                                    }}
                                                />
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            )}
                        </Box>
                    </Box>
                );
            }}
        </MenuDropdown>
    );
}
