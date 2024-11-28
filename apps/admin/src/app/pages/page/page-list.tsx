import React, { useState, useCallback, useRef } from 'react';
import { Container, Button } from '@mui/material';
import { DataTable, DataTableColumn, DataTableHandle, TableActionMenu } from '@admin/app/components';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import AddEditPageDialog from '../../sections/page/add-edit-page-dialog';
import { IPage } from '@libs/types';
import { usePage } from '@admin/app/hooks/use-page';
import { errorMessage, useToasty } from '@libs/react-core';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';

export default function PageList() {

    const [dataTableFilters, setDataTableFilters] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const datatableRef = useRef<DataTableHandle>(null);
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();

    const { useGetManyPage, useDeletePage } = usePage();
    const { mutateAsync: deletePage } = useDeletePage();

    const { data } = useGetManyPage(dataTableFilters, {
        enabled: Boolean(dataTableFilters), // Disable initial api call
    });

    const handleAddEdit = useCallback(
        (item = {}) => () => {
            setSelectedItem(item); // Open dialog for adding a new item
        },
        []
    );

    const handleDelete = useCallback((id) => {
        confirmDialog({ message: "Are you sure you want to delete page?" })
            .then(() => {
                deletePage(id).then(() => {
                    datatableRef.current.refresh();
                    showToasty('Page successfully delete')
                }).catch((error) => {
                    showToasty(errorMessage(error, "Error while deleting Page"), 'error');
                });
            }).catch(() => {
                // Nothing
            })
    }, [confirmDialog, deletePage, showToasty]);

    const handleDataTableChange = useCallback((filters) => {
        // Manage filters mapping here.
        setDataTableFilters(filters)
    }, []);

    const columns: DataTableColumn<IPage>[] = [
        {
            name: 'name',
            label: 'Name',
            isSearchable: true,
            isSortable: true,
        },
        {
            name: 'title',
            label: 'Title',
            isSearchable: true,
            isSortable: true,
        },
        {
            name: 'slug',
            label: 'Slug',
        },
        {
            name: 'action',
            label: 'Action',
            render: (row) => (
                <TableActionMenu
                    row={row}
                    onDelete={() => handleDelete(row.id)}
                    onEdit={handleAddEdit(row)}
                />
            ),
        },
    ];

    return (
        <Page title="Page Management">
            <Container>
                <CustomBreadcrumbs
                    heading="Page List"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Page' },
                    ]}
                    action={
                        <Button variant="contained" onClick={handleAddEdit()}>
                            Add Page
                        </Button>
                    }
                />
                <DataTable
                    initialLoading
                    ref={datatableRef}
                    data={data?.items}
                    columns={columns}
                    totalRow={data?.total}
                    defaultOrderBy="createdAt"
                    onChange={handleDataTableChange}
                />
                {selectedItem !== null && (
                    <AddEditPageDialog
                        onClose={() => setSelectedItem(null)}
                        initialValue={selectedItem}
                    // onSubmit={(data) => {
                    //     datatableRef.current.refresh();
                    // }}
                    />
                )}
            </Container>
        </Page>
    );
}
