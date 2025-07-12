import {
    Box,
    Checkbox,
    Chip,
    IconButton,
    Avatar,
    Stack,
    TextField,
    TextFieldProps,
} from '@mui/material';
import MuiAutocomplete, {
    AutocompleteProps as MuiAutocompleteProps,
    createFilterOptions,
} from '@mui/material/Autocomplete';
import { has, isEqual, keyBy, map } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';


const filter = createFilterOptions<any>();

export interface AutocompleteNewProps
    extends Omit<MuiAutocompleteProps<any, any, any, any>, 'renderInput' | 'onChange'> {
    options: any[];
    value?: any;
    valueKey?: string;
    labelKey?: string;
    avatarKey?: string;
    hasAvatar?: boolean;
    avatarOnly?: boolean;
    nullable?: boolean;
    required?: boolean;
    label?: string;
    placeholder?: string;
    helperText?: any;
    error?: any;
    size?: 'small' | 'medium';
    onChange?: (values: any, mainValue?: any) => void;
    renderLabel?: (values: any) => any;
    creatable?: boolean;
    onCreate?: (value: string) => any;
    canDeleteOptions?: (option: any) => boolean;
    deletable?: boolean;
    onDelete?: (option: any) => any;
    textFieldProps?: TextFieldProps;
    showCheckBox?: boolean;
}

export function AutocompleteNew({
    options = [],
    value: initialValue,
    valueKey,
    labelKey,
    avatarKey = 'avatarUrl',
    hasAvatar,
    onChange,
    avatarOnly,
    required,
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
    showCheckBox = false,
    ...otherProps
}: AutocompleteNewProps) {
    const [selectedValue, setSelectedValue] = useState(initialValue);

    const getOptionLabel = useMemo(() => {
        return (option: any) => {
            if (typeof option === 'string') return option;
            if (option?.inputValue) return option.inputValue;
            if (labelKey && option[labelKey]) return option[labelKey];
            if (valueKey && option[valueKey]) return option[valueKey];
            return '';
        };
    }, [labelKey, valueKey]);

    const handleOnChange = useCallback(
        async (_event: any, newValue: any) => {
            let fullValue = newValue;
            let newCreatedValue;

            if (typeof newValue === 'string' || newValue?.inputValue) {
                const valueText = newValue.inputValue || newValue;
                newCreatedValue = onCreate ? await onCreate(valueText) : valueText;
                fullValue = newCreatedValue;
            } else {
                newCreatedValue = newValue;
            }

            let updatedValue: any = newCreatedValue;
            if (valueKey) {
                if (multiple) {
                    updatedValue = map(newCreatedValue, valueKey);
                } else {
                    updatedValue = newCreatedValue?.[valueKey] ?? newCreatedValue;
                }
            }

            setSelectedValue(updatedValue);
            onChange?.(updatedValue, fullValue);
        },
        [
            multiple,
            onChange,
            onCreate,
            valueKey,
        ],
    );

    useEffect(() => {
        if (valueKey && initialValue) {
            const byValueKey = keyBy(options, valueKey);
            let valueObj: any;

            if (multiple) {
                valueObj = initialValue.map((item) => {
                    const id = has(item, valueKey) ? item[valueKey] : item;
                    return byValueKey[id] || (creatable ? {
                        [valueKey]: id,
                        [labelKey]: id,
                    } : id);
                });
            } else {
                const id = has(initialValue, valueKey) ? initialValue[valueKey] : initialValue;
                valueObj =
                    byValueKey[id] || (creatable ? {
                        [valueKey]: id,
                        [labelKey]: id,
                    } : id);
            }

            if (!isEqual(valueObj, selectedValue)) setSelectedValue(valueObj);
        } else if (!isEqual(initialValue, selectedValue)) {
            setSelectedValue(initialValue);
        }
    }, [
        initialValue,
        valueKey,
        labelKey,
        options,
        multiple,
        selectedValue,
        creatable,
    ]);

    const handleDelete = useCallback(
        (option) => (event) => {
            event.stopPropagation();
            event.preventDefault();
            onDelete?.(option);
        },
        [onDelete],
    );

    return (
        <MuiAutocomplete
            multiple={multiple}
            options={options || []}
            getOptionLabel={(option: any) => {
                if (typeof option === 'string') return option;
                if (option?.inputValue) return `Add "${option.inputValue}"`;
                return getOptionLabel(option);
            }}
            filterOptions={
                creatable
                    ? (allOptions, params) => {
                        const filtered = filter(allOptions, params);
                        const { inputValue } = params;

                        const isExisting = allOptions.some(
                            (option) => inputValue === getOptionLabel(option) ||
                                inputValue === option?.inputValue ||
                                inputValue === option?.[labelKey],
                        );

                        if (inputValue !== '' && !isExisting) {
                            const newOption: any = {
                                inputValue,
                                [valueKey || 'value']: inputValue,
                                [labelKey || 'label']: inputValue,
                            };
                            filtered.push(newOption);
                        }

                        return filtered;
                    }
                    : undefined
            }
            renderOption={(props, option, { selected }) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    component="li"
                    alignItems="center"
                    {...props}
                >
                    <Box
                        sx={{
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {multiple && showCheckBox ? <Checkbox checked={selected} /> : null}
                        {hasAvatar ? (
                            <Avatar
                                alt={getOptionLabel(option)}
                                src={option[avatarKey]}
                                sx={{ marginRight: 1 }}
                            />
                        ) : null}
                    </Box>
                    <Box
                        sx={{
                            width: 1,
                            flexShrink: 1,
                        }}
                    >
                        {option.inputValue ? (
                            <>
                                Add "
                                {option.inputValue}
                                "
                            </>
                        ) : (
                            getOptionLabel(option)
                        )}
                    </Box>
                    {deletable && !option.inputValue && canDeleteOptions?.(option) ? (
                        <IconButton onClick={handleDelete(option)}>
                            <Icon icon={IconEnum.Trash} />
                        </IconButton>
                    ) : null}
                </Stack>
            )}
            renderTags={(value, getTagProps) => {
                if (multiple) {
                    return (
                        <>
                            {value.slice(0, limitTags).map((option: any, index) => (
                                <Chip
                                    key={option[valueKey] || option[labelKey]}
                                    size="small"
                                    avatar={
                                        hasAvatar ? (
                                            <Avatar
                                                alt={getOptionLabel(option)}
                                                src={option[avatarKey]}
                                            />
                                        ) : undefined
                                    }
                                    label={getOptionLabel(option)}
                                    {...getTagProps({ index })}
                                />
                            ))}
                            {value.length > limitTags && ` + ${value.length - limitTags} `}
                        </>
                    );
                }

                if (hasAvatar) {
                    return (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <Avatar
                                alt={getOptionLabel(value)}
                                src={value?.[avatarKey]}
                            />
                            {getOptionLabel(value)}
                        </Stack>
                    );
                }

                return getOptionLabel(value);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    error={Boolean(error)}
                    helperText={error?.message || helperText}
                    required={required}
                    {...(textFieldProps || {})}
                    size={size}
                    sx={{ ...textFieldProps?.sx }}
                />
            )}
            value={selectedValue}
            onChange={handleOnChange}
            {...(creatable
                ? {
                    freeSolo: true,
                    selectOnFocus: true,
                    clearOnBlur: true,
                    handleHomeEndKeys: true,
                }
                : {})}
            {...otherProps}
        />
    );
}
