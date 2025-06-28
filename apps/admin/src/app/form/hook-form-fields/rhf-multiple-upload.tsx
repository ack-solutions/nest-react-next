import { FormHelperText, FormLabel } from '@mui/material';
import { clone, uniqueId } from 'lodash';
import { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

import {
    CustomFile,
    UploadMultiFile,
    UploadMultiFileProps,
} from '../fields/upload';


export interface RHFMultipleUploadProps extends UploadMultiFileProps {
    label?: string;
    previewUrl?: string;
    name: string;
    onRemoveImage?: (imageId: string, index: number, value: any) => void;
    control?: Control;
}

export function RHFMultipleUpload({
    control,
    name,
    label,
    previewUrl,
    onRemoveImage,
    ...props
}: RHFMultipleUploadProps) {
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: [],
    });

    const files: CustomFile[] = useMemo(() => {
        if (!value) {
            return [];
        }
        return value.map((file: any) => {
            if (file instanceof File) {
                return {
                    key: uniqueId(),
                    name: file.name,
                    size: file.size,
                    preview: URL.createObjectURL(file),
                };
            }
            return {
                key: uniqueId(),
                name: null,
                size: null,
                preview: file as string,
            };
        });
    }, [value]);

    const handleDrop = useCallback(
        (acceptedFiles) => {
            let newValue = [];
            if (!value) {
                newValue = acceptedFiles;
            } else {
                newValue = value.concat(acceptedFiles);
            }
            onChange(newValue);
        },
        [onChange, value],
    );

    const handleRemove = useCallback(
        (file, index) => {
            const imageId = file?.preview?.id;
            if (imageId && onRemoveImage) {
                onRemoveImage(imageId, index, value);
            } else {
                const newValues = clone(value);
                newValues.splice(index, 1);
                onChange(newValues);
            }
        },
        [
            onChange,
            onRemoveImage,
            value,
        ],
    );

    return (
        <>
            {label ? <FormLabel>{label}</FormLabel> : null}
            <UploadMultiFile
                files={files}
                error={!!error}
                onDrop={handleDrop}
                onRemove={handleRemove}
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
