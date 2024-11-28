import React, { useCallback, useEffect, useMemo, useState } from 'react'
import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Stack } from '@mui/system';
import { Box, Checkbox, Chip, IconButton } from '@mui/material';
import { get, has, isEqual, keyBy, map } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '../../components/avatar';

const filter = createFilterOptions<any>();

export interface AutocompleteOptionType {
    [x: string]: any;
}

export interface AutocompleteProps extends Omit<MuiAutocompleteProps<any, any, any, any>, 'renderInput' | 'onChange'> {
    options: AutocompleteOptionType[];
    value?: any;
    valueKey?: string;
    labelKey?: string;
    avatarKey?: string;
    hasAvatar?: boolean;
    avatarOnly?: boolean
    nullable?: boolean
    label?: string;
    placeholder?: string;
    helperText?: any;
    error?: any;
    size?: "small" | "medium";
    onChange?: (values: any) => void;
    renderLabel?: (values: any) => any;
    creatable?: boolean;
    onCreate?: (value: string) => any;
    canDeleteOptions?: (option: any) => boolean;
    deletable?: boolean;
    onDelete?: (option: any) => any;
    textFieldProps?: TextFieldProps
}

export function Autocomplete({
    options = [],
    value: initialValue,
    valueKey,
    labelKey,
    avatarKey = 'avatarUrl',
    hasAvatar,
    onChange,
    avatarOnly,
    label,
    limitTags = 999,
    placeholder,
    multiple,
    error,
    size,
    helperText,
    creatable,
    onCreate,
    deletable,
    canDeleteOptions,
    onDelete,
    textFieldProps,
    nullable,
    ...otherProps
}: AutocompleteProps) {

    const [selectedValue, setSelectedValue] = useState(initialValue);

    const handleDelete = useCallback(
        (option) => (event) => {
            event.stopPropagation();
            event.preventDefault();

            if (onDelete) {
                onDelete(option)
            }
        },
        [onDelete],
    )


    const handleOnChange = useCallback(
        async (event, newValue) => {
            // Create a new value from the user input
            let newCreatedValue;
            if (typeof newValue === 'string' || newValue?.inputValue) {
                let valueText
                if (typeof newValue === 'string') {
                    valueText = newValue
                } else {
                    valueText = newValue.inputValue
                }

                if (onCreate) {
                    newCreatedValue = await onCreate(valueText);
                } else {
                    newCreatedValue = valueText
                }
            } else {
                newCreatedValue = newValue;
            }

            let updatedValue: any = newCreatedValue;
            if (valueKey) {
                if (multiple) {
                    updatedValue = map(newCreatedValue, valueKey)
                } else {
                    updatedValue = newCreatedValue && newCreatedValue[valueKey] ? newCreatedValue[valueKey] : newCreatedValue;
                }
            }

            setSelectedValue(updatedValue);
            if (onChange) {
                onChange(updatedValue);
            }
        },
        [multiple, onChange, onCreate, valueKey],
    );

    const getOptionLabel = useMemo(() => {
        if (otherProps.getOptionLabel) {
            return otherProps.getOptionLabel
        }
        return (option) => {
            if (option && option[labelKey] !== undefined) {
                return get(option, labelKey)
            }
            if (option && option[valueKey] !== undefined) {
                return get(option, valueKey);
            }
            return option

        }
    }, [labelKey, otherProps.getOptionLabel, valueKey])


    useEffect(() => {

        if (valueKey && initialValue) {
            const byValueKey = keyBy(options, valueKey);
            let valueObj: any;
            if (multiple) {
                valueObj = (initialValue).map((item) => {
                    let id = item
                    if (has(id, valueKey)) {
                        id = item[valueKey]
                    }
                    return byValueKey[id]
                })
            } else if (byValueKey[initialValue]) {
                valueObj = byValueKey[initialValue];
            } else if (creatable) {
                valueObj = {
                    [valueKey]: initialValue
                }
            }
            if (!isEqual(valueObj, selectedValue)) {
                setSelectedValue(valueObj)
            }
        } else if (!isEqual(initialValue, selectedValue)) {
            setSelectedValue(initialValue)
        }

    }, [creatable, initialValue, labelKey, multiple, options, selectedValue, valueKey])



    return (
        <MuiAutocomplete
            multiple={multiple}
            options={options || []}
            getOptionLabel={(option: any) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option?.inputValue) {
                    return `${option?.inputValue}`;
                }
                // Regular option
                return getOptionLabel(option);
            }}

            renderOption={((props, option: any, { selected }) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    component="li"
                    alignItems='center'
                    {...props}
                >
                    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {multiple && (
                            <Checkbox
                                checked={selected}
                            />
                        )}
                        {hasAvatar && (
                            <Avatar
                                alt={getOptionLabel(option)}
                                src={option[avatarKey]}
                                size='small'
                                sx={{
                                    marginRight: 1
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ width: 1, flexShrink: 1 }}>
                        {getOptionLabel(option)}
                    </Box>

                    <Box sx={{ flexShrink: 0 }}>
                        {(deletable && !option.inputValue && canDeleteOptions(option)) && (
                            <IconButton onClick={handleDelete(option)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                </Stack>
            ))}
            renderTags={(value, getTagProps) => {
                if (multiple) {

                    const numTags = value.length;
                    if (avatarOnly && hasAvatar) {
                        return (
                            <Stack direction='row' spacing={0.5}>
                                {value.slice(0, limitTags).map((option: any, index) => (
                                    <Avatar
                                        size='small'
                                        key={index}
                                        alt={getOptionLabel(option)}
                                        src={option[avatarKey]}
                                    />
                                ))}
                                {numTags > limitTags && ` + ${numTags - limitTags} `}
                            </Stack>
                        )
                    }

                    return (
                        <>
                            {value instanceof Array && value?.slice(0, limitTags)?.map((option: any, index) => (
                                <Chip
                                    key={index}
                                    size='small'
                                    avatar={hasAvatar ? (<Avatar alt={getOptionLabel(option)} src={option[avatarKey]} />) : null}
                                    label={getOptionLabel(option)}
                                    {...getTagProps({ index })}
                                />
                            ))}
                            {numTags > limitTags && ` + ${numTags - limitTags} `}
                        </>
                    );
                }

                if (value) {
                    return (hasAvatar ? (
                        <Stack>
                            <Avatar size='small' alt={getOptionLabel(value)} src={value[avatarKey]} />
                            {getOptionLabel(value)}
                        </Stack>
                    ) : getOptionLabel(value))
                };

                return '';
            }}
            value={selectedValue}
            onChange={handleOnChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    error={Boolean(error)}
                    helperText={error ? error?.message : helperText}
                    {...(textFieldProps || {})}
                    InputProps={{
                        ...(params?.InputProps || {}),
                        ...(textFieldProps?.InputProps || {})
                    }}
                    sx={{
                        ...textFieldProps?.sx
                    }}
                    size={size}
                />
            )}
            {...(creatable ? {
                freeSolo: true,
                selectOnFocus: true,
                clearOnBlur: true,
                handleHomeEndKeys: true,
                filterOptions: (allOptions, params) => {
                    const filtered = filter(allOptions, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value

                    const isExisting = allOptions.some((option) => inputValue === getOptionLabel(option));
                    if (inputValue !== '' && !isExisting) {
                        const obj: any = { inputValue };
                        if (labelKey || valueKey) {
                            if (labelKey) {
                                obj[labelKey] = `Add "${inputValue}"`;
                            }
                            if (valueKey) {
                                obj[valueKey] = inputValue;
                            }
                        }
                        filtered.push(obj);
                    }

                    return filtered;
                }
            } : {})}
            {...otherProps}
            sx={{
                ...otherProps.sx,
                inputRoot: {
                    paddingRight: '48px',
                    ...(otherProps.sx as any)?.inputRoot
                },
            }}
        />
    )
}
