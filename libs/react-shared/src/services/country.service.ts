import { ICountry, ICountrySearchInput } from '@libs/types';

import { CRUDService } from './crud-service';


export class CountryService extends CRUDService<ICountry> {

    protected apiPath = 'country';

    searchCountry(request?: ICountrySearchInput) {
        return this.instanceApi.get<ICountry[]>(`${this.apiPath}/country-search`, { params: request }).then(({ data }) => data);
    }

}
