import { ICountry, ICountrySearchInput } from '@libs/types';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { CountryService } from '../services';


const service = CountryService.getInstance<CountryService>();

export const useCountry = () => {
    const useSearchCountry = (request?: ICountrySearchInput, options?: Partial<DefinedInitialDataOptions<ICountry[]>>) => {
        return useQuery({
            queryKey: ['countries', request],
            queryFn: () => service.searchCountry(request),
            ...options,
        });
    };

    return {
        useSearchCountry,
    };
};
