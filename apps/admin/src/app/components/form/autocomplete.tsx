import TextField, { TextFieldProps } from '@mui/material/TextField';
import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@mui/material/Autocomplete';
import { useCallback, useMemo } from 'react';
import { Box, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { find, includes, map } from 'lodash';
import { Replay } from '@mui/icons-material';
import { TextFieldRaw } from './text-field-raw';


export interface AutocompleteProps extends MuiAutocompleteProps<any, any, any, any> {
  renderKey?: string;
  valueKey?: string;
  label?: string;
  multiple?: any;
  freeSolo?: any;
  required?: boolean;
  renderInputProps: TextFieldProps;
  onRefreshOptions?: () => void;
}

const Autocomplete = ({
    options = [],
    label,
    freeSolo,
    value,
    renderKey = 'name',
    valueKey = 'id',
    multiple,
    required,
    onChange,
    renderInputProps,
    onRefreshOptions,
    ...props
}: AutocompleteProps) => {

    const autocompleteValue = useMemo(() => {
        if (valueKey && value && !multiple) {
            const selectedOption = find(options, { [valueKey]: value });
            return selectedOption || '';
        }
        if (valueKey && renderKey && value?.length > 0 && multiple) {
            const valueIds = (typeof value[0] === 'object') ? map(value, valueKey) : value;
            const selectedOption = options?.filter((option) => includes(valueIds, option[valueKey]));
            return selectedOption || [];
        }
        return value || (multiple ? [] : '');
    }, [value, valueKey, multiple, options]);

    const handleChange = useCallback(
        (event?: any, newValue?: any) => {
            let val = newValue;
            if (newValue && valueKey && !multiple) {
                val = newValue[valueKey];
            }
            if (newValue?.length > 0 && valueKey && multiple) {
                val = map(newValue, valueKey);
            }
            onChange && onChange(event, val, 'selectOption');
        },
        [valueKey, onChange]
    );

    const handleBlur = useCallback(
        (e?: any) => {
            const val = e.target.value || '';
            if (freeSolo && val && !multiple) {
                let item: any;
                const { getOptionLabel = (option: any) => option[renderKey] || '' } = props;

                item = find(options, (option: any) => getOptionLabel(option) === val);
                onChange && onChange(e, item, 'blur');
            }
        },
        [freeSolo, multiple, props, onChange, options, renderKey]
    );
    return (
        <Box width="100%">
            <MuiAutocomplete
                value={autocompleteValue || ''}
                options={options || []}
                multiple={multiple}
                onChange={handleChange}
                freeSolo={freeSolo}
                {...(renderKey ? { getOptionLabel: (option:any) => option[renderKey] || '' } : {})}
                renderInput={(params: any) => (
                    <TextFieldRaw
                        {...params}
                        label={label}
                        required={required}
                        fullWidth
                        onBlur={handleBlur}
                        variant="outlined"
                        {...renderInputProps}
                        slotProps={{
                            inputAdornment: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {params.InputProps.endAdornment}
                                        {onRefreshOptions && (
                                            <Tooltip title='Refresh'>
                                                <IconButton onClick={onRefreshOptions} size='small'>
                                                    <Replay fontSize='small' />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default Autocomplete;
