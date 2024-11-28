import { DataTable, DataTableColumn, DataTableHandle, TableActionMenu } from '@admin/app/components'
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import { PageService, useToasty } from '@libs/react-core'
import { IPage } from '@libs/types'
import { toDisplayDate } from '@libs/utils'
import { Button, Container } from '@mui/material'
import { startCase } from 'lodash'
import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const pageService = PageService.getInstance<PageService>();

const PageList = () => {
  const { showToasty } = useToasty();
  const [pages, setPages] = useState<IPage[]>(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const deleteConfirm = useConfirm();
  const datatableRef = useRef<DataTableHandle>(null);

  const handleOpenEditPage = useCallback(
    (raw: IPage) => () => {
      console.log(`${PATH_DASHBOARD.page.edit}/${raw?.id}`);
      
      navigate(`${PATH_DASHBOARD.page.edit}/${raw?.id}`)
    },
    [],
  )

  const handleDeletePage = useCallback(
    (row: any) => {
      if (row.id) {
        deleteConfirm(
          {
            title: "Delete",
            description: `Are you sure you want to delete this page?`
          })
          .then(async () => {
            try {
              if (row.deletedAt) {
                await pageService.trashDelete(row.id)
              }
              else {
                await pageService.delete(row.id).
                  then(() => {
                    // 
                  })
                  .catch((error) => {
                    showToasty(error.message, 'error');
                  });
              }
              datatableRef?.current?.refresh();
              showToasty('Page successfully deleted');
            } catch (error: any) {
              showToasty(error, 'error');
            }
          })
          .catch(() => {
            //
          });
      }

    },
    [deleteConfirm, showToasty]
  );

  const handleDataTableChange = useCallback((filter: any) => {
    filter = {
      ...filter,
      s: {
        ...filter?.s,
      },
    };
    pageService.getMany(filter).then((data) => {
      setPages(data?.items || []);
      setTotal(data?.total || 0);
    });
  }, []);

  const columns: DataTableColumn<IPage>[] = [
    {
      name: 'name',
      label: 'Name',
      isSearchable: true,
      isSortable: true,
    },
    {
      name: 'template',
      label: 'Template',
      isSearchable: true,
      isSortable: true,
      render: (row) => startCase(row?.template)
    },
    {
      name: 'slug',
      label: 'Slug',
      isSearchable: true,
      isSortable: true,
    },
    {
      name: 'createdAt',
      label: 'Created Date',
      isSearchable: false,
      isSortable: true,
      render: (row) => toDisplayDate(row?.createdAt),
    },
    {
      name: 'action',
      label: 'Action',
      isAction: true,
      render: (row: any) => (
        <TableActionMenu
          row={row}
          onDelete={() => handleDeletePage(row)}
          {...!row?.deletedAt ? { onEdit: handleOpenEditPage(row) } : {}}
        />
      ),
      props: { sx: { width: 150 } }
    },
  ];
  return (
    <Page title='Pages'>
      <Container>
        <CustomBreadcrumbs
          heading="Pages"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Pages', href: PATH_DASHBOARD.users.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant='contained'
              onClick={() => navigate(`${PATH_DASHBOARD.page.add}`)}
            >
              Add Page
            </Button>
          }
        />
        <DataTable
          data={pages}
          columns={columns}
          ref={datatableRef}
          totalRow={total}
          defaultOrder='desc'
          defaultOrderBy='createdAt'
          onChange={handleDataTableChange}
          // onRowClick={handleRowClick}
          hasFilter
          selectable
        />
      </Container>
    </Page>
  )
}

export default PageList