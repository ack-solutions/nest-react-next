import { FieldProps } from 'formik';
import { useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import { map } from 'lodash';
import Autocomplete, { AutocompleteProps } from '../autocomplete';

export interface AutocompleteFieldProps extends FieldProps, AutocompleteProps {

}

export const AutocompleteField = ({
  form: { setFieldValue, touched, errors },
  field: { name, value },
  valueKey,
  ...props
}: AutocompleteFieldProps) => {

  // const autocompleteValue = useMemo(() => {
  //   if (value?.length > 0 && valueKey) {
  //     const valueIds = (typeof value[0] === 'object') ? map(value, valueKey) : value
  //     setFieldValue(name, valueIds);
  //     return valueIds || []
  //   }
  // }, [value, valueKey]);

  const handleChange = useCallback(
    (event?: any, newValue?: any) => {
      setFieldValue(name, newValue);
    },
    [name, setFieldValue]
  );

  console.log(value);
  
  return (
    <Box width="100%">
      <Autocomplete
        value={value}
        onChange={handleChange}
        // renderInputProps={{
        //   error: touched[name] && !!errors[name],
        //   helperText: touched[name] && !!errors[name] ? errors[name] : ''
        // }}
        {...props}
      />
    </Box>
  );
};


