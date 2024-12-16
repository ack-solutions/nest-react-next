import { IPage } from '@libs/types';
import { Container, Button } from '@mui/material';
import { useState, useCallback } from 'react';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs/custom-breadcrumbs';
import Page from '../../components/page';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPageDialog from '../../sections/page/add-edit-page-dialog';
import PageListTable from '../../sections/page/page-list-table';


export default function PageList() {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleAddEditClose = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const handleAddEdit = useCallback((item: Partial<IPage> = {}) => {
        setSelectedItem(item);
    }, []);

    return (
        <Page title="Page">
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Page List"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root
                        },
                        { name: 'Page' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            onClick={() => handleAddEdit()}
                        >
                            Add Page
                        </Button>
                    }
                />
                <PageListTable onEdit={handleAddEdit} />
                {selectedItem && (
                    <AddEditPageDialog
                        initialValue={selectedItem}
                        onClose={handleAddEditClose}
                    />
                )}
            </Container>
        </Page>
    );
}
