
import { FieldProps } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { UploadProps } from '../../upload/type';
import { UploadAvatar } from '../../upload';

export interface UploadAvatarFieldProps extends FieldProps, UploadProps {
    label: string;
    previewUrl?: string;
}

export const UploadAvatarField = ({
    form: { setFieldValue, touched, errors },
    field: { name, value },
    label,
    small,
    previewUrl,
    ...props
}: UploadAvatarFieldProps) => {

    const [fileUrl, setFileUrl] = useState<any>(null);

    useEffect(() => {
        if (previewUrl) {
            console.log(previewUrl, 'previewUrl');
            setFileUrl(previewUrl)
        }
    }, [previewUrl])


    const handleDrop = useCallback(
        (acceptedFiles: any) => {
            const file = acceptedFiles[0];
            if (file) {
                setFileUrl(URL.createObjectURL(file));
                setFieldValue(name, file);
            }
        },
        [setFieldValue, name]
    );

    return (
        <UploadAvatar
            small
            file={fileUrl}
            label={label}
            onDrop={handleDrop}
            error={Boolean(touched[name] && errors[name])}
            {...props}
        />
    );
};


