import { FormHelperText, FormLabel } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Control, useController } from 'react-hook-form';

import UploadSingleFile, { UploadSingleFileProps } from '../fields/upload/upload-single-file';


export interface RHFSingleUploadProps extends UploadSingleFileProps {
    label?: string;
    previewUrl?: string;
    name?: string;
    control?: Control;
    onHandleDrop?: (acceptedFiles: File[]) => void;
}

function RHFSingleUpload({
    control,
    name,
    label,
    previewUrl,
    isVideo,
    onHandleDrop,
    ...props
}: RHFSingleUploadProps) {
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: null,
    });

    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (onHandleDrop) { onHandleDrop(acceptedFiles); }
            if (file) {
                setFileUrl(URL.createObjectURL(file));
                onChange(file);
            }
        },
        [onChange, onHandleDrop],
    );

    const handleRemove = useCallback(() => {
        setFileUrl(null);
        onChange(null);
    }, [onChange]);

    useEffect(() => {
        if (previewUrl) {
            setFileUrl(previewUrl);
        }
    }, [previewUrl]);

    return (
        <>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <UploadSingleFile
                previewUrl={fileUrl}
                file={value}
                onRemove={handleRemove}
                onDrop={handleDrop}
                isVideo={isVideo}
                error={!!error}
                accept={{ 'image/*': ['*'] }}
                {...props}
            />
            {error ? (
                <FormHelperText
                    error
                    sx={{ px: 2 }}
                >
                    {error.message}
                </FormHelperText>
            ) : null}
        </>
    );
}

export default RHFSingleUpload;
