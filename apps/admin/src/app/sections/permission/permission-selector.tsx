import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
    Grid,
} from '@mui/material';
import { startCase } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';


interface PermissionSelectorProps {
    allPermissions: string[];
    selectedPermissions: string[];
    onChange: (updated: string[]) => void;
}

function PermissionSelector({
    allPermissions,
    selectedPermissions,
    onChange,
}: PermissionSelectorProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set(selectedPermissions));
    const [search, setSearch] = useState<string>('');

    const filteredPermissions = useMemo(() => {
        if (search) {
            const findText = search.toString().toLowerCase();
            let results: any[] = [];
            try {
                results = allPermissions?.filter((item) => {
                    if (typeof item === 'string') {
                        return (`${item}`.toLowerCase().replace(/-/g, ' ').includes(findText));
                    }
                    return false;
                });
            } catch (error) {
                console.error(error);
                results = [];
            }
            return results;
        }
        return allPermissions;
    }, [allPermissions, search]);

    const allSelectedData = useMemo(() => {
        let isAllSelected = false;
        let isIntermediate = false;
        if (selected.size > 0) {
            isAllSelected = filteredPermissions.every((p) => selected.has(p));
            isIntermediate = isAllSelected ? false : filteredPermissions.some((p) => selected.has(p));
        }
        return {
            isAllSelected,
            isIntermediate,
        };
    }, [filteredPermissions, selected]);


    useEffect(() => {
        setSelected(new Set(selectedPermissions));
    }, [selectedPermissions]);

    // const togglePermission = (perm: IPermission) => {
    //     const isSelected = selected.some((p) => p.id === perm.id);
    //     let updated: IPermission[] = [];

    //     if (isSelected) {
    //         // Remove this permission and its children
    //         updated = selected.filter(
    //             (p) => p.id !== perm.id && !isDependentOn(p, perm),
    //         );
    //     } else {
    //         // Add this permission and its dependencies
    //         const required = getDependencies(perm);
    //         updated = Array.from(new Set([
    //             ...selected,
    //             ...required,
    //             perm,
    //         ]));
    //     }

    //     setSelected(updated);
    //     onChange(updated);
    // };

    const togglePermission = useCallback((perm: any) => {
        const isSelected = selected.has(perm);

        if (isSelected) {
            selected.delete(perm);
        } else {
            selected.add(perm);
        }

        setSelected(new Set(selected));
        onChange(Array.from(selected));
    }, [selected, onChange]);


    const handleAllSelectToggle = useCallback((_event: React.ChangeEvent<HTMLInputElement>, _checked: boolean) => {
        if (allSelectedData.isAllSelected) {
            filteredPermissions.forEach((item) => {
                selected.delete(item);
            });
        } else {
            filteredPermissions.forEach((item) => {
                selected.add(item);
            });
        }
        setSelected(new Set(selected));
        onChange(Array.from(selected));
    }, [
        filteredPermissions,
        onChange,
        allSelectedData,
        selected,
    ]);

    return (
        <Paper
            sx={{
                p: 2,
                width: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={allSelectedData.isAllSelected}
                                indeterminate={allSelectedData.isIntermediate}
                                onChange={handleAllSelectToggle}
                            />
                        )}
                        label="Select All"
                    />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        (
                        {selected.size}
                        {' '}
                        of
                        {' '}
                        {allPermissions.length}
                        {' '}
                        selected)
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    label="Search Permission"
                    name="search"
                    size="small"
                    type="search"
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                    sx={{
                        maxWidth: 300,
                    }}
                />
            </Box>
            <Divider
                sx={{
                    my: 2,
                }}
            />
            <Box>
                <Grid
                    container
                    spacing={2}
                >
                    {filteredPermissions.map((perm) => (
                        <Grid
                            key={perm}
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4,
                            }}>
                            <Box>
                                <FormControlLabel
                                    control={(
                                        <Checkbox
                                            checked={selected.has(perm)}
                                            onChange={() => togglePermission(perm)}
                                        />
                                    )}
                                    label={startCase(perm)}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );
}

export default PermissionSelector;
