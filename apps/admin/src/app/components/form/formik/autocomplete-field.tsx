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


  const handleChange = useCallback(
    (event?: any, newValue?: any) => {
      setFieldValue(name, newValue);
    },
    [name, setFieldValue]
  );

  return (
    <Box width="100%">
      <Autocomplete
        value={value}
        onChange={handleChange}
        {...props}
      />
    </Box>
  );
};


