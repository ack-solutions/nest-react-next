import { useState, useCallback, useRef, MutableRefObject } from 'react';
import { DataTableColumn, DataTableHandle } from '../../components';
import { IPage, PageStatusEnum } from '@libs/types';
import { usePage } from '@libs/react-core';
import { Tabs, Tab, Card, Divider, Typography } from '@mui/material';
import { CrudTable, CrudTableActions } from '../../components/crud/crud-table';
import StatusLabel from 'libs/react-core/src/lib/components/status-label';
import { startCase } from 'lodash';

export interface PageListTableProps {
    datatableRef?: MutableRefObject<DataTableHandle>;
    onEdit?: (row: IPage) => void;
}

const filterTabs = [
    {
        label: 'All',
        value: 'all',
    },
    {
        label: startCase(PageStatusEnum.PUBLISHED),
        value: PageStatusEnum.PUBLISHED,
    },
    {
        label: startCase(PageStatusEnum.UNPUBLISHED),
        value: PageStatusEnum.UNPUBLISHED,
    },
    {
        label: startCase(PageStatusEnum.DRAFT),
        value: PageStatusEnum.DRAFT,
    },
];

export interface PageListFilters {
    status?: string;
}

export default function PageListTable({ onEdit }: PageListTableProps) {
    const [customFilters, setCustomFilters] = useState<PageListFilters>({
        status: 'all',
    });
    const datatableRef = useRef<CrudTableActions>(null);

    const {
        useGetManyPage,
        useDeletePage,
        useRestorePage,
        useDeleteForeverPage,
        useBulkDeletePage,
        useBulkRestorePage,
        useBulkDeleteForeverPage,
    } = usePage();

    const handleTabChange = useCallback((_event, value) => {
        setCustomFilters((state) => ({
            status: value,
        }));
        datatableRef.current.applyFilters((state) => ({
            ...state,
            where: {
                ...value != 'all' ? { status: { $eq: value } } : {},
            }
        }));
    }, [datatableRef]);

    const columns: DataTableColumn<IPage>[] = [
        {
            name: 'title',
            label: 'title',
        },
        {
            name: 'slug',
            label: 'slug',
        },
        {
            name: 'content',
            label: 'content',
            render: (row) => <Typography dangerouslySetInnerHTML={{ __html: row?.content }} />
        },
        {
            name: 'status',
            label: 'status',
            render: (row) => <StatusLabel label={row?.status} />
        },
        // {
        //     name: 'metaData',
        //     label: 'metaData',
        // },
        {
            name: 'name',
            label: 'name',
        },
    ];

    return (
        <Card>
            <Tabs
                value={customFilters?.status}
                onChange={handleTabChange}
                sx={{ px: 3 }}
            >
                {filterTabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        iconPosition="end"
                        value={tab.value}
                        label={tab.label}
                        disableRipple
                    />
                ))}
            </Tabs>
            <Divider />
            <CrudTable
                hasSoftDelete
                crudName="Page"
                crudOperationHooks={{
                    useGetMany: useGetManyPage,
                    useDelete: useDeletePage,
                    useRestore: useRestorePage,
                    useDeleteForever: useDeleteForeverPage,
                    useBulkDelete: useBulkDeletePage,
                    useBulkRestore: useBulkRestorePage,
                    useBulkDeleteForever: useBulkDeleteForeverPage,
                }}
                onEdit={onEdit}
                ref={datatableRef}
                columns={columns}
            />
        </Card>
    );
}
