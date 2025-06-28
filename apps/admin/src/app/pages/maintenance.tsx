import { Page } from '../components';
import { Maintenance as ErrorMaintenance } from '../components/error/maintenance';


function Maintenance() {
    return (
        <Page title="Maintenance">
            <ErrorMaintenance />
        </Page>
    );
}

export default Maintenance;
