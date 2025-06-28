import { useState } from 'react';
import * as yup from 'yup';

import { TextFieldRaw, TextFieldRawProps } from './text-field-raw';


interface YupValidateTextFieldProps extends TextFieldRawProps {
    validationSchema?: yup.AnySchema;
    onChange?: (value: any) => void;
    defaultValue?: any
}

export function YupValidateTextField({ validationSchema, onChange, defaultValue, ...props }: YupValidateTextFieldProps) {
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        validate(newValue);
        if (onChange) onChange(newValue);
    };

    const handleBlur = () => {
        validate(value);
    };

    const validate = async (inputValue: any) => {
        try {
            await validationSchema.validate(inputValue);
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <TextFieldRaw
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error}
            helperText={error}
            {...props}
        />
    );
}
