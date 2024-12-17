import { Checkbox, CheckboxProps, FormControl, FormControlLabel, formControlLabelClasses, FormGroup, FormHelperText, FormLabel, SxProps } from '@mui/material'
import React, { ReactNode } from 'react'


export interface CheckBoxGroupProps extends Omit<CheckboxProps, 'onChange'> {
  options: { label: string; value: any }[];
  row?: boolean;
  label?: string;
  spacing?: number;
  error?: boolean;
  value: string[];
  sx?: SxProps;
  helperText?: ReactNode;
  onChange: (val?: string[]) => void
}


export const CheckBoxGroup = ({
    options,
    row,
    label,
    error,
    spacing,
    sx,
    value = [],
    onChange,
    helperText,
    ...other
}: CheckBoxGroupProps) => {

    const getSelected = (selectedItems: string[] = [], item: string) => {
        return selectedItems.includes(item) ? selectedItems.filter((value) => value !== item) : [...selectedItems, item];
    }

    return (
        <FormControl component="fieldset" >
            {label && (
                <FormLabel
                    component="legend"
                    sx={{ typography: 'body2' }}
                >
                    {label}
                </FormLabel>
            )}
            <FormGroup
                sx={{
                    ...(row && {
                        flexDirection: 'row'
                    }),
                    [`& .${formControlLabelClasses.root}`]: {
                        '&:not(:last-of-type)': {
                            mb: spacing || 0
                        },
                        ...(row && {
                            mr: 0,
                            '&:not(:last-of-type)': {
                                mr: spacing || 2
                            }
                        })
                    },
                    ...sx
                }}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={value.includes(option.value)}
                                onChange={() => onChange(getSelected(value, option.value))}
                                {...other}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>
            {(error || helperText) && (
                <FormHelperText
                    error={error}
                    sx={{ mx: 0 }}
                >
                    {helperText}
                </FormHelperText>
            )}
        </FormControl >
    )
}
