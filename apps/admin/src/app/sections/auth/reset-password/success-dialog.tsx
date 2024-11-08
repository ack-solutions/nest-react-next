import { PATH_AUTH } from '@admin/app/routes/paths';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DefaultDialog } from '@admin/app/components';

export interface SuccessDialogProps {
    onClose?: () => void;
}

const SuccessDialog = ({
    onClose
}: SuccessDialogProps) => {

    return (
        <DefaultDialog
            maxWidth='sm'
            fullWidth
            onClose={onClose}
            actions={
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    sx={{ mt: 1, marginX: '40px' }}
                >
                    Continue
                </Button>
            }
        >
            <Stack
                alignItems='center'
                justifyContent='center'
                paddingBottom='0px'
            >
                <Box
                    component='img'
                    marginBottom='20px'
                    margin='auto'
                    width='100%'
                    height={150}
                    src="assets/image/success.png"
                    alt="login"
                    sx={{ objectFit: 'contain' }}
                />
                <Box>
                    <Typography
                        textAlign='center'
                        marginBottom='30px'
                        variant='h3'
                    >
                        Password Reset Successfully!
                    </Typography>
                    <Typography
                        textAlign='center'
                        fontWeight='bold'
                    >
                        Hurrah!! You have successfully verified the account.
                    </Typography>
                </Box>
            </Stack>
        </DefaultDialog>
    )
}

export default SuccessDialog