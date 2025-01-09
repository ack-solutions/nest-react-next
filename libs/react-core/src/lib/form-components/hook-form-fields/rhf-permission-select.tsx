import { Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormHelperText, InputLabel, Skeleton, Stack, TextField, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { cloneDeep, isEqual } from 'lodash';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useController, Control } from 'react-hook-form';


export interface PermissionSelectFieldProps {
    name: string;
    control?: Control;
    label: string | ReactNode;
    options: any[];
    column: 1 | 2 | 3 | 4 | 6 | 12;
    renderValue: string;
    renderLabel: string;
    isLoading?: boolean
}

export const RHFPermissionSelectField = ({
    name,
    control,
    label,
    options: allOptions,
    column,
    renderValue,
    renderLabel,
    isLoading,
}: PermissionSelectFieldProps) => {
    const [selected, setSelected] = useState<any>({});
    const [searchValue, setSearchValue] = useState('');
    const theme = useTheme();

    const { field, fieldState: { error } } = useController({
        name,
        control,
        defaultValue: [],
    });

    const options = useMemo(() => {
        if (searchValue && searchValue !== '') {
            return allOptions.filter((option: any) => {
                return option[renderLabel]?.toLocaleLowerCase()?.includes(searchValue.toLocaleLowerCase());
            });
        }
        return allOptions;
    }, [
        searchValue,
        renderLabel,
        allOptions,
    ]);

    const handleChange = useCallback(
        async (event: any, checked: any) => {
            const newValues = {
                ...selected,
                [event.target.name]: checked,
            };

            const values = Object.keys(newValues).filter((key) => newValues[key]);
            setSelected(newValues);
            field.onChange(values);
        },
        [selected, field],
    );

    const handleSearchChange = useCallback(
        (event: any) => {
            setSearchValue(event.target.value);
        },
        [],
    );

    const handleSelectToggle = useCallback(
        (isSelect: any) => () => {
            setSelected((state: any) => {
                const updatedState = cloneDeep(state);
                options.forEach((option: any) => {
                    updatedState[option[renderValue]] = isSelect;
                });

                const values = Object.keys(updatedState).filter((key) => updatedState[key]);
                field.onChange(values);
                return updatedState;
            });
        },
        [
            renderValue,
            options,
            field,
        ],
    );

    useEffect(() => {
        const obj: any = {};
        if (field.value?.length > 0) {
            for (const key of field.value) {
                obj[key] = true;
            }
            if (!isEqual(obj, selected)) {
                setSelected(obj);
            }
        }
    }, [selected, field.value]);

    return (
        <Box>
            {label && (
                <InputLabel
                    margin="dense"
                    sx={{
                        ...theme.typography.body2,
                        color: 'text.secondary',
                        mb: 0.5,
                    }}
                >
                    {label}
                </InputLabel>
            )}
            <FormHelperText color="error">{error?.message}</FormHelperText>

            <Card
                sx={{
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 400,
                    overflow: 'hidden',
                }}
            >
                <CardHeader
                    action={
                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row',
                            }}
                            spacing={2}
                        >
                            <TextField
                                placeholder="Search in Permissions"
                                size="small"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <Button onClick={handleSelectToggle(true)}>Select All</Button>
                            <Button onClick={handleSelectToggle(false)}>Unselect All</Button>
                        </Stack>
                    }
                />
                <CardContent
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        flex={1}
                        overflow="auto"
                    >
                        {isLoading ? (
                            [...Array(10)].map((index) => (
                                <Grid
                                    size={{ sm: 12 / column }}
                                    key={index}
                                >
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                    >
                                        <Skeleton
                                            variant="rectangular"
                                            height={20}
                                            width={20}
                                            sx={{
                                                borderRadius: 1,
                                                marginBottom: 1,
                                                mr: 2,
                                            }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="80%"
                                            sx={{ marginBottom: 1 }}
                                        />
                                    </Box>

                                </Grid>
                            ))
                        ) : (
                            options.map((option: any) => (
                                <Grid
                                    size={{ sm: 12 / column }}
                                    key={option[renderValue]}
                                >
                                    <FormControlLabel
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
                            ))
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};
