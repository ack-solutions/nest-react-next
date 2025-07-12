import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, IconButton, Typography } from '@mui/material';
import { Box, Drawer, Stack } from '@mui/material';
import { Children, KeyboardEvent, MouseEvent, ReactNode, cloneElement, isValidElement, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ObjectSchema } from 'yup';

import { FormContainer } from '../form';
import { Icon } from './icons/icon';
import { IconEnum } from './icons/icons';


export interface FilterDrawerProps {
    children?: ReactNode;
    open?: boolean;
    title?: string;
    width?: number;
    onClose?: () => void;
    onReset?: () => void;
    onSubmit?: (data: any) => void;
    validationSchema?: ObjectSchema<any>;
    defaultValues?: Record<string, any>;
}

function FilterDrawer({
    children,
    title = 'Filter',
    open,
    width = 400,
    onClose,
    onReset,
    onSubmit,
    validationSchema,
    defaultValues = {},
}: FilterDrawerProps) {
    const formContext = useForm({
        resolver: validationSchema ? yupResolver(validationSchema) : undefined,
        defaultValues,
    });
    const { handleSubmit, reset } = formContext;


    const handleOpenDrawer = useCallback(
        (event: KeyboardEvent | MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as KeyboardEvent).key === 'Tab' ||
                    (event as KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            if (open) {
                if (onClose) { onClose(); }
            }
        },
        [onClose, open],
    );

    const handleReset = useCallback(
        () => {
            reset();
            if (onReset) { onReset(); }
        },
        [onReset, reset],
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleOpenDrawer}
        >
            <Box
                sx={{
                    width: {
                        xs: 360,
                        sm: width,
                    },
                    py: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3.5 }}
                >
                    <Typography variant="h4">{title}</Typography>
                    <IconButton onClick={onClose}>
                        <Icon icon={IconEnum.X} />
                    </IconButton>
                </Stack>

                <FormContainer
                    formProps={{
                        id: 'filter-drawer',
                        style: {
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                    formContext={formContext}
                    onSuccess={onSubmit}

                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            overflow: 'auto',
                            px: 3.5,
                            pt: 2,
                        }}
                    >
                        {Children.map(children, (child) => {
                            if (isValidElement(child)) {
                                return cloneElement(child);
                            }
                            return child;
                        })}
                    </Box>

                    <Box sx={{ px: 3.5 }}>
                        <Divider sx={{ my: 2 }} />
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Filter
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                type="button"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Box>
                </FormContainer>
            </Box>
        </Drawer>
    );
}

export default FilterDrawer;
