import { useState, useEffect, useCallback } from 'react';
import { Control, useController } from 'react-hook-form';

import { UploadAvatar } from '../../components/upload';
import { UploadProps } from '../../components/upload/type';


export interface RHFUploadAvatarProps extends UploadProps {
    label?: string;
    control?: Control;
    name: string;
    previewUrl?: string;
    small?: boolean;
}

export const RHFUploadAvatar = ({
    label,
    control,
    name,
    previewUrl,
    small,
    ...props
}: RHFUploadAvatarProps) => {
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
        <UploadAvatar
            small={small}
            file={fileUrl}
            label={label}
            onDrop={handleDrop}
            error={!!error}
            helperText={error?.message}
            accept={{ 'image/*': [] }}
            {...props}
        />
    );
};
