import { IconButton, InputAdornment } from '@mui/material'
import { forwardRef, Ref } from 'react'
import { useBoolean } from '../../hook';
import { RHFTextField, RHFTextFieldProps } from './rhf-text-field';
import { Icon } from '../../components';

export type RHFPasswordProps = RHFTextFieldProps

export const RHFPassword = forwardRef((
    props: RHFPasswordProps,
    ref: Ref<HTMLDivElement>
) => {
    const showPassword = useBoolean()

    return (
        <RHFTextField
            ref={ref}
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                                <Icon icon={showPassword.value ? 'eye' : 'eye-slash'} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }
            }}
            {...props}
        />
    )
})
