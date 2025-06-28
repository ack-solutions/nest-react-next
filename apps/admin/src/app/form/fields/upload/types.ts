import { SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';


// @mui

import { CustomFile } from './upload-multi-file';


export type { CustomFile, UploadMultiFileProps } from './upload-multi-file';

export interface UploadProps extends DropzoneOptions {
    error?: boolean;
    file?: CustomFile | string | null;
    helperText?: ReactNode;
    sx?: SxProps<Theme>;
    small?: boolean;
    preview?: string;
    imageFitMode?: 'cover' | 'contain';
}
