export interface CurrencyOption {
    name: string;
    isoCode: string;
    symbol: string;
}

// Comprehensive list of popular world currencies
export const POPULAR_CURRENCIES: CurrencyOption[] = [
    // Major World Currencies
    {
        name: 'US Dollar',
        isoCode: 'USD',
        symbol: '$',
    },

    // Major Trade Currencies
    {
        name: 'Canadian Dollar',
        isoCode: 'CAD',
        symbol: 'C$',
    },
    {
        name: 'Australian Dollar',
        isoCode: 'AUD',
        symbol: 'A$',
    },

    // Asian Currencies
    {
        name: 'Indian Rupee',
        isoCode: 'INR',
        symbol: '₹',
    },
    {
        name: 'Sri Lankan Rupee',
        isoCode: 'LKR',
        symbol: '₨',
    },
    {
        name: 'New Zealand Dollar',
        isoCode: 'NZD',
        symbol: 'NZ$',
    },

    {
        name: 'UAE Dirham',
        isoCode: 'AED',
        symbol: 'د.إ',
    },
    {
        name: 'South African Rand',
        isoCode: 'ZAR',
        symbol: 'R',
    },


];

// Group currencies by region for better organization
export const CURRENCY_REGIONS = {
    'Major Currencies': [
        'USD',
        'CAD',
        'AUD',
    ],
    'Asia Pacific': [
        'INR',
        'LKR',
        'NZD',
    ],
    'Middle East & Africa': ['AED', 'ZAR'],
};

export const getCurrenciesByRegion = (region: keyof typeof CURRENCY_REGIONS): CurrencyOption[] => {
    const isoCodes = CURRENCY_REGIONS[region];
    return POPULAR_CURRENCIES.filter(currency => isoCodes.includes(currency.isoCode));
};

export const searchCurrencies = (
    currencies: CurrencyOption[],
    searchTerm: string,
): CurrencyOption[] => {
    if (!searchTerm) return currencies;

    const term = searchTerm.toLowerCase();
    return currencies.filter(currency => currency.name.toLowerCase().includes(term) ||
        currency.isoCode.toLowerCase().includes(term) ||
        currency.symbol.toLowerCase().includes(term));
};
