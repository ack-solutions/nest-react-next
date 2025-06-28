import {
    TextField as MUITextField,
    TextFieldProps as MUITextFieldProps,
    Box,
    SxProps,
} from '@mui/material';
import { omit } from 'lodash';
import { memo } from 'react';


export interface TextFieldRawProps extends Omit<MUITextFieldProps, 'name'> {
    name?: string;
    boxSx?: SxProps;
}

export const TextFieldRaw = memo(
    ({ label, boxSx, fullWidth, ...props }: TextFieldRawProps) => {
        const hasValue = !!(props?.value !== null && props?.value !== undefined && props?.value !== '');
        return (
            <Box
                sx={{
                    width: fullWidth ? 1 : 'auto',
                    ...boxSx,
                }}
            >
                {/* {label && (
        <InputLabel
          disabled={!!props?.disabled}
          required={!!props?.required}
          error={!!props?.error}
          htmlFor={props?.name}
          margin='dense'
          sx={{
            ...theme.typography.body2,
            color: 'text.secondary', mb: 0.5
          }}
        >
          {label}
        </InputLabel>
      )} */}

                <MUITextField
                    label={label}
                    id={props?.name}
                    fullWidth
                    variant="outlined"
                    slotProps={{
                        input: {
                            ...(props?.type === 'number' && {
                                onWheel: (e) => (e.target as HTMLInputElement)?.blur(),
                            }),
                            ...props?.slotProps?.input,
                        },
                        inputLabel: { shrink: hasValue },
                        ...props?.slotProps,
                    }}
                    {...omit(props, 'label')}
                />
            </Box>
        );
    },
);
