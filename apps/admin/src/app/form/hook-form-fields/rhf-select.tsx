import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { get, isArray, startCase } from 'lodash';
import { forwardRef, useEffect, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { RHFTextField } from './rhf-text-field';
import { useBoolean } from '../../hook';
import { TextFieldRaw, TextFieldRawProps } from '../fields/text-field-raw';


type RHFSelectProps = TextFieldRawProps & {
    name: string;
    native?: boolean;
    nullable?: boolean;
    maxHeight?: boolean | number;
    options?: any[];
    valueKey?: string;
    labelKey?: string;
    isMultiple?: boolean;
    isStartCase?: boolean; // If true, the options will be displayed as start case;
    withCheckboxes?: boolean; // If true, the options will be displayed as checkboxes Only on multiple select;
    returnFullObjects?: boolean
};

export const RHFSelect = forwardRef(({
    name,
    helperText,
    children,
    native,
    nullable = false,
    options,
    valueKey,
    labelKey,
    slotProps,
    isMultiple,
    withCheckboxes = true,
    isStartCase = true,
    returnFullObjects = false,
    ...other
}: RHFSelectProps, ref) => {
    const { control } = useFormContext();
    const isShowCheckboxes = useBoolean(false);

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const currentValue = useMemo(() => {
        if (isMultiple) {
            if (isArray(field.value)) {
                return returnFullObjects
                    ? field.value.map((val) => get(val, valueKey, val))
                    : field.value;
            }
            return [];
        }
        return returnFullObjects ? get(field.value, valueKey, field.value) : field.value ?? (nullable ? null : '');
    }, [
        field.value,
        isMultiple,
        nullable,
        returnFullObjects,
        valueKey,
    ]);


    const OptionsComponent = native ? 'option' : MenuItem;

    const handleChange = (event: any) => {
        const selected = event.target.value;

        if (isMultiple) {
            const newValue = returnFullObjects
                ? selected.map((val: any) => options.find((opt) => get(opt, valueKey, opt) === val))
                : selected;
            field.onChange(newValue);
        } else {
            const newValue = returnFullObjects
                ? options.find((opt) => get(opt, valueKey, opt) === selected)
                : selected ?? null;
            field.onChange(newValue);
        }
    };


    useEffect(() => {
        if (isMultiple && withCheckboxes) {
            isShowCheckboxes.onTrue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMultiple, withCheckboxes]);

    const renderValue = useMemo(() => {
        return (selected: any) => {
            if (isMultiple && selected) {
                return (selected as any[])
                    .map((val) => startCase(
                        get(
                            options?.find((opt) => get(opt, valueKey, opt) === val) ?? {},
                            labelKey,
                            val,
                        ),
                    ))
                    .join(', ');
            }

            const found = get(
                options?.find((opt) => get(opt, valueKey, opt) === selected) ?? {},
                labelKey,
                selected,
            );
            return isStartCase ? startCase(found) : found;
        };
    }, [
        isMultiple,
        options,
        labelKey,
        valueKey,
        isStartCase,
    ]);


    return (
        <RHFTextField
            ref={ref as any}
            name={name}
            control={control}
            value={currentValue}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message ?? helperText}
            component={TextFieldRaw}
            slotProps={{
                ...slotProps,
                select: {
                    ...(isMultiple && { multiple: true }),
                    native,
                    renderValue,
                    ...slotProps?.select,
                },
                inputLabel: {
                    shrink: !!field.value,
                },
            }}
            select
            fullWidth
            {...other}
        >
            {nullable ? <OptionsComponent value={null as any}>None</OptionsComponent> : null}

            {options?.map((option) => {
                const optionValue = get(option, valueKey || '', option);
                const isChecked = isMultiple ? currentValue.includes(optionValue) : currentValue === optionValue;
                const label = get(option, labelKey || '', option);
                return (
                    <OptionsComponent
                        key={optionValue}
                        value={optionValue}
                    >
                        {isShowCheckboxes.value ? (
                            <Checkbox
                                checked={isChecked}
                                style={{ marginRight: 8 }}
                            />
                        ) : null}
                        {isStartCase ? startCase(label) : label}
                    </OptionsComponent>
                );
            })}

            {children}
        </RHFTextField>
    );
});
