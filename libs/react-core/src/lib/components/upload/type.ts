import { ReactNode } from 'react';
import { DropzoneOptions } from 'react-dropzone';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export interface CustomFile extends Partial<File> {
  path?: string;
  preview?: string;
  key?: string;
  percentage?: any;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  file?: CustomFile | string | null;
  sx?: SxProps<Theme>;
  small?: boolean;
  helperText?: any;
  preview?: any;
  label?: string;
}


