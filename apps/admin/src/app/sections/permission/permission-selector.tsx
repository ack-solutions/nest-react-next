import { Icon } from '@admin/app/components';
import { IconEnum } from '@admin/app/components/icons/icons';
import type { IPermission } from '@libs/types';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { groupBy, startCase } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';


export type PermissionSelectorProps = {
    allPermissions: IPermission[];
    selectedPermissions: string[];
    onChange: (updated: string[]) => void;
    /** When true, selection cannot be changed (e.g. system role details). */
    readOnly?: boolean;
};

function PermissionSelector({
    allPermissions,
    selectedPermissions,
    onChange,
    readOnly = false,
}: PermissionSelectorProps) {
    const [selected, setSelected] = useState<Set<string>>(
        new Set(selectedPermissions),
    );
    const [search, setSearch] = useState<string>('');

    const filteredPermissions = useMemo(() => {
        if (search) {
            const findText = search.toString().toLowerCase();
            return (allPermissions?.filter((item) => {
                return (item.name
                    ?.toLowerCase()
                    .replace(/-/g, ' ')
                    .includes(findText) || item.category?.toLowerCase().includes(findText));
            }) || []);
        }
        return allPermissions || [];
    }, [allPermissions, search]);

    const groupedPermissions = useMemo(() => {
        const grouped = groupBy(
            filteredPermissions,
            (p) => p.category || 'Other',
        );
        const sortedCategories = Object.keys(grouped).sort();
        return sortedCategories.map((category) => ({
            category,
            permissions: grouped[category],
        }));
    }, [filteredPermissions]);

    const allSelectedData = useMemo(() => {
        const permissionNames = filteredPermissions.map((p) => p.name);
        const selectedCount = permissionNames.filter((p) => selected.has(p)).length;
        const totalCount = permissionNames.length;

        const isAllSelected =
            totalCount > 0 && selectedCount === totalCount;
        const isIntermediate =
            selectedCount > 0 && selectedCount < totalCount;

        return {
            isAllSelected,
            isIntermediate,
            selectedCount,
            totalCount,
        };
    }, [filteredPermissions, selected]);

    const getCategorySelectionState = useCallback(
        (permissions: IPermission[]) => {
            const permissionNames = permissions.map((p) => p.name);
            const selectedInCategory = permissionNames.filter((p) => selected.has(p));
            const isAllSelected =
                selectedInCategory.length === permissionNames.length &&
                permissionNames.length > 0;
            const isIntermediate =
                !isAllSelected && selectedInCategory.length > 0;
            return {
                isAllSelected,
                isIntermediate,
                selectedCount: selectedInCategory.length,
            };
        },
        [selected],
    );

    useEffect(() => {
        setSelected(new Set(selectedPermissions));
    }, [selectedPermissions]);

    const togglePermission = useCallback(
        (permName: string) => {
            if (readOnly) {
                return;
            }
            const newSelected = new Set(selected);
            if (newSelected.has(permName)) {
                newSelected.delete(permName);
            } else {
                newSelected.add(permName);
            }
            setSelected(newSelected);
            onChange(Array.from(newSelected));
        },
        [
            selected,
            onChange,
            readOnly,
        ],
    );

    const toggleCategory = useCallback(
        (permissions: IPermission[]) => {
            if (readOnly) {
                return;
            }
            const newSelected = new Set(selected);
            const permissionNames = permissions.map((p) => p.name);
            const { isAllSelected } =
                getCategorySelectionState(permissions);

            if (isAllSelected) {
                permissionNames.forEach((name) => newSelected.delete(name));
            } else {
                permissionNames.forEach((name) => newSelected.add(name));
            }

            setSelected(newSelected);
            onChange(Array.from(newSelected));
        },
        [
            selected,
            onChange,
            getCategorySelectionState,
            readOnly,
        ],
    );

    const handleAllSelectToggle = useCallback(() => {
        if (readOnly) {
            return;
        }
        const newSelected = new Set(selected);
        const permissionNames = filteredPermissions.map((p) => p.name);

        if (allSelectedData.isAllSelected) {
            permissionNames.forEach((name) => newSelected.delete(name));
        } else {
            permissionNames.forEach((name) => newSelected.add(name));
        }

        setSelected(newSelected);
        onChange(Array.from(newSelected));
    }, [
        filteredPermissions,
        onChange,
        allSelectedData,
        selected,
        readOnly,
    ]);

    return (
        <Paper sx={{
            p: 1.5,
            width: 1,
        }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    pb: 1,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <FormControlLabel
                        control={(
                            <Checkbox
                                checked={allSelectedData.isAllSelected}
                                indeterminate={allSelectedData.isIntermediate}
                                onChange={handleAllSelectToggle}
                                size="small"
                                disabled={readOnly}
                            />
                        )}
                        label={(
                            <Typography variant="body2">Select All</Typography>
                        )}
                        sx={{ mr: 0 }}
                    />
                    <Typography variant="caption" sx={{
                        color: "text.secondary"
                    }}>
                        (
                        {allSelectedData.selectedCount}
                        /
                        {allSelectedData.totalCount}
                        )
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    placeholder="Search..."
                    name="search"
                    size="small"
                    type="search"
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                        maxWidth: 250,
                        '& .MuiInputBase-root': { height: 36 },
                    }}
                />
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box>
                {groupedPermissions.map(({ category, permissions }) => {
                    const categoryState =
                        getCategorySelectionState(permissions);

                    return (
                        <Accordion
                            key={category}
                            defaultExpanded
                            disableGutters
                            sx={{
                                '&:before': { display: 'none' },
                                boxShadow: 'none',
                                border: '1px solid',
                                borderColor: 'divider',
                                mb: 0.5,
                                borderRadius: 1,
                                '&:last-of-type': { mb: 0 },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={(
                                    <Icon icon={IconEnum.ChevronDown} width={20} />
                                )}
                                sx={{
                                    backgroundColor: 'action.hover',
                                    minHeight: 40,
                                    margin: 0,
                                    px: 1.5,
                                    '&.Mui-expanded': {
                                        minHeight: 40,
                                        margin: 0,
                                    },
                                    '& .MuiAccordionSummary-content': {
                                        margin: 0,
                                        '&.Mui-expanded': { margin: 0 },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: readOnly ? 'default' : 'pointer',
                                    }}
                                    onClick={(e) => {
                                        if (readOnly) {
                                            return;
                                        }
                                        e.stopPropagation();
                                        toggleCategory(permissions);
                                    }}
                                >
                                    <Checkbox
                                        checked={categoryState.isAllSelected}
                                        indeterminate={
                                            categoryState.isIntermediate
                                        }
                                        onChange={() => toggleCategory(permissions)}
                                        onClick={(e) => e.stopPropagation()}
                                        size="small"
                                        sx={{ p: 0.5 }}
                                        disabled={readOnly}
                                    />
                                    <Typography variant="subtitle2">
                                        {category}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "text.secondary"
                                        }}
                                    >
                                        (
                                        {categoryState.selectedCount}
                                        /
                                        {permissions.length}
                                        )
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{
                                p: 1.5,
                                pt: 1,
                            }}>
                                <Grid container spacing={0.5} rowSpacing={0}>
                                    {permissions.map((perm) => (
                                        <Grid
                                            key={perm.id || perm.name}
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 4,
                                                lg: 3,
                                            }}
                                        >
                                            <FormControlLabel
                                                sx={{
                                                    ml: 0,
                                                    mr: 0,
                                                    width: '100%',
                                                    cursor: readOnly
                                                        ? 'default'
                                                        : 'pointer',
                                                }}
                                                control={(
                                                    <Checkbox
                                                        checked={selected.has(
                                                            perm.name,
                                                        )}
                                                        onChange={() => togglePermission(
                                                            perm.name,
                                                        )}
                                                        size="small"
                                                        sx={{ p: 0.5 }}
                                                        disabled={readOnly}
                                                    />
                                                )}
                                                label={(
                                                    <Typography variant="body2">
                                                        {startCase(
                                                            perm.name.replace(
                                                                /-/g,
                                                                ' ',
                                                            ),
                                                        )}
                                                    </Typography>
                                                )}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}

                {groupedPermissions.length === 0 && (
                    <Box sx={{
                        py: 4,
                        textAlign: 'center',
                    }}>
                        <Typography sx={{
                            color: "text.secondary"
                        }}>
                            {search
                                ? 'No permissions match your search'
                                : 'No permissions available'}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

export default PermissionSelector;
