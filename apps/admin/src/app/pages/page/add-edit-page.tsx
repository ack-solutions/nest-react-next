import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'

const AddEditPage = () => {
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
            </Container>
        </Page>
    )
}

export default AddEditPage