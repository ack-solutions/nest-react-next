import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import AddEditPageForm from '@admin/app/sections/page/add-edit-page-form'
import { PageService, useToasty } from '@libs/react-core'
import { IPage } from '@libs/types'
import { Button, Container } from '@mui/material'
import { FormikHelpers, FormikProps } from 'formik'
import { omit } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'

const pageService = PageService.getInstance<PageService>();

const AddEditPage = () => {
    const { pageId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate()
    const [pageValue, setPageValue] = useState<IPage>()
    const formRef = useRef<FormikProps<any>>();

    const handleSubmit = useCallback((value, action: FormikHelpers<any>) => {
        const request = {
            ...omit(value, ['id', 'createdAt', 'updatedAt', 'deletedAt']),
        };

        if (value?.id) {
            pageService
                .update(value?.id, request)
                .then((data) => {
                    showToasty(`Page updated successfully.`);
                    action.setSubmitting(false);
                    navigate(`${PATH_DASHBOARD.page.root}`);
                })
                .catch((error) => {
                    action.setSubmitting(false);
                    showToasty(error.message || `Error, while update Page Update.`, 'error')
                });
        } else {
            pageService
                .create(request)
                .then((data) => {
                    showToasty(`Page added successfully.`);
                    action.setSubmitting(false);
                    navigate(`${PATH_DASHBOARD.page.root}`);
                })
                .catch((error) => {
                    action.setSubmitting(false);
                    showToasty(error.message || `Error, while update Page add.`, 'error')
                });
        }
    }, []);


    useEffect(() => {
        if (pageId) {
            pageService.getOne(pageId).then((data) => {
                setPageValue(data)
            });
        }
    }, [pageId])
    
    return (
        <Page title='Pages'>
            <Container>
                <CustomBreadcrumbs
                    heading="Pages"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Pages', href: PATH_DASHBOARD.page.root },
                        { name: 'List' },
                    ]}
                />
                <AddEditPageForm pageValue={pageValue} onSubmit={handleSubmit} ref={formRef} />
                <Button
                    component={RouterLink}
                    sx={{ mr: 2 }}
                    to={PATH_DASHBOARD.page.root}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => formRef.current.handleSubmit()}
                >
                    Save
                </Button>
            </Container>
        </Page>
    )
}

export default AddEditPage