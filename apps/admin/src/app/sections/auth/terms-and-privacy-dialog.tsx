import { usePage } from '@libs/react-shared';
import { Box, Button } from '@mui/material';

import { DefaultDialog } from '../../components';


interface TermsAndPrivacyDialogProps {
    slug?: string
    onClose?: () => void
}

function TermsAndPrivacyDialog({ slug, onClose }: TermsAndPrivacyDialogProps) {
    const { useGetBySlug } = usePage();
    const { data } = useGetBySlug(slug);

    if (!data) {
        return null;
    }

    return (
        <DefaultDialog
            title={data?.title}
            onClose={onClose}
            fullWidth
            actions={(
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>
            )}
        >
            <Box
                component="div"
                dangerouslySetInnerHTML={{
                    __html: data?.content,
                }}
            />
        </DefaultDialog>
    );
}

export default TermsAndPrivacyDialog;
