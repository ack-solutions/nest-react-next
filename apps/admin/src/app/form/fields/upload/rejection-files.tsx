// @mui
// utils
import { Box, Paper, Typography, alpha } from '@mui/material';
import { FileRejection } from 'react-dropzone';

import { fData, getFileData } from './utils';


type RejectionFilesProps = {
    fileRejections: FileRejection[];
};

export default function RejectionFiles({
    fileRejections,
}: RejectionFilesProps) {
    return (
        <Paper
            variant="outlined"
            sx={{
                py: 1,
                px: 2,
                mt: 3,
                borderColor: 'error.light',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }}
        >
            {fileRejections.map(({ file, errors }) => {
                const { path, size } = getFileData(file);

                return (
                    <Box
                        key={path}
                        sx={{ my: 1 }}
                    >
                        <Typography
                            variant="subtitle2"
                            noWrap
                        >
                            {path}
                            {' '}
                            -
                            {size ? fData(size) : ''}
                        </Typography>

                        {errors.map((error) => (
                            <Box
                                key={error.code}
                                component="li"
                                sx={{ typography: 'caption' }}
                            >
                                {error.message}
                            </Box>
                        ))}
                    </Box>
                );
            })}
        </Paper>
    );
}
