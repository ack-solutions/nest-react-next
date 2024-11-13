import { ErrorMessage, FieldProps } from 'formik';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormHelperText, Grid, Stack, TextField } from '@mui/material';
import { cloneDeep, isEqual } from 'lodash';
import Label from '../../label/label';

export interface PermissionSelectFieldProps extends FieldProps {
  options: Array<{ value: any; label: string }>;
  label: string | ReactNode;
  column: 1 | 2 | 3 | 4 | 6 | 12;
  renderValue: string;
  renderLabel: string
}

export const PermissionSelectField = ({
  form: { setFieldValue },
  field: { name, value },
  label,
  options: allOptions,

  column,
  renderValue,
  renderLabel
}: PermissionSelectFieldProps) => {
  const [selected, setSelected] = useState<any>({});
  const [searchValue, setSearchValue] = useState('');

  const options = useMemo(() => {
    if (searchValue && searchValue != '') {
      return allOptions?.filter((option: any) => {
        return option[renderLabel]?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase())
      })
    } else {
      return allOptions;
    }
  }, [searchValue, renderLabel, allOptions])

  const handleChange = useCallback(
    async (event: any, checked: any) => {
      const newValues = {
        ...selected,
        [event.target.name]: checked,
      };

      const values = Object.keys(newValues).filter((key) => newValues[key]);
      setFieldValue(name, values);
      await setSelected(newValues);
    },
    [selected],
  );

  const handleSearchChange = useCallback(
    (event: any) => {
      setSearchValue(event.target.value);
    },
    [],
  )

  const handleSelectToggle = useCallback(
    (isSelect: any) => () => {

      setSelected((state: any) => {
        const updatedState = cloneDeep(state);
        options.forEach((option: any) => {
          updatedState[option[renderValue]] = isSelect
        })

        const values = Object.keys(updatedState).filter((key) => updatedState[key]);
        setFieldValue(name, values);
        return updatedState;
      })
    },
    [renderValue, name, options],
  )

  useEffect(() => {
    const obj: any = {}

    if (value) {
      for (const key of value) {
        obj[key] = true;
      }

      if (!isEqual(obj, selected)) {
        setSelected(obj);
      }

    }
  }, [selected, value])


  return (
    <Box>
      {label && (<Label>{label}</Label>)}

      <FormHelperText color="error"><ErrorMessage name={name} /></FormHelperText>

      <Card sx={{
        border: '1px solid',
        borderColor: `rgba(0, 0, 0, 0.23)`,
        // p: 2,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 400,
        overflow: 'hidden',
      }}>
        <CardHeader
          action={
            (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <TextField
                  placeholder='Search in Permissions'
                  size='small'
                  value={searchValue}
                  onChange={handleSearchChange}
                />
                <Button
                  onClick={handleSelectToggle(true)}
                >
                  Select All
                </Button>
                <Button
                  onClick={handleSelectToggle(false)}
                >
                  Unselect All
                </Button>
              </Stack>
            )
          }
        />
        <CardContent
          sx={{
            flex: 1,
            overflow: 'auto'
          }}
        >
          <Grid
            container
            spacing={2}
            flex={1}
            overflow={'auto'}
          >
            {options && options.map((option: any, index) => (
              <Grid item sm={12 / column}>
                <FormControlLabel
                  key={option[renderValue]}
                  control={
                    <Checkbox
                      checked={!!selected[option[renderValue]]}
                      name={option[renderValue]}
                      onChange={handleChange}
                    />
                  }
                  label={option[renderLabel]}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};


