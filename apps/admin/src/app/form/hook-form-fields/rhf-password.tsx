import { IconButton, InputAdornment } from '@mui/material';
import { forwardRef, Ref, useCallback, useState } from 'react';

import { RHFTextField, RHFTextFieldProps } from './rhf-text-field';
import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';


export type RHFPasswordProps = RHFTextFieldProps;

export const RHFPassword = forwardRef(
    (props: RHFPasswordProps, ref: Ref<HTMLDivElement>) => {
        const [showPassword, setShowPassword] = useState(false);

        const handleToggle = useCallback(() => {
            setShowPassword((state) => !state);
        }, []);

        return (
            <RHFTextField
                ref={ref}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleToggle}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Icon icon={IconEnum.EyeOff} />
                                    ) : (
                                        <Icon icon={IconEnum.Eye} />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                {...props}
            />
        );
    },
);
