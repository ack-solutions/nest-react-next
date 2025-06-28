import { Box, FormLabel } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { Control, useController } from 'react-hook-form';

import { UploadAvatar, UploadProps } from '../fields/upload';


export interface RHFUploadAvatarProps extends Omit<UploadProps, 'file'> {
    control?: Control;
    name: string;
    previewUrl?: string;
    small?: boolean;
    label?: string;
}

export function RHFUploadAvatar({
    control,
    name,
    previewUrl,
    small,
    label,
    ...props
}: RHFUploadAvatarProps) {
    const [fileUrl, setFileUrl] = useState<any>(null);

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    useEffect(() => {
        if (previewUrl) {
            setFileUrl(previewUrl);
        }
    }, [previewUrl]);

    const handleDrop = useCallback(
        (acceptedFiles: any) => {
            const file = acceptedFiles[0];
            if (file) {
                setFileUrl(URL.createObjectURL(file));
                field.onChange(file);
            }
        },
        [field],
    );

    return (
        <Box>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <UploadAvatar
                small={small}
                file={field.value}
                preview={fileUrl}
                onDrop={handleDrop}
                error={!!error}
                helperText={error?.message}
                accept={{ 'image/*': [] }}
                {...props}
            />
        </Box>
    );
}
