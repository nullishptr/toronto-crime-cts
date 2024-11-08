import { CrimeFeature, CTSSite, ControlSite } from '../types/crimeData';

export const CRIME_TYPES = [
    'ASSAULT',
    'AUTOTHEFT',
    'BIKETHEFT',
    'BREAKENTER',
    'ROBBERY',
    'SHOOTING',
    'THEFTFROMMV',
    'THEFTOVER',
] as const;

export const CTS_SITES: CTSSite[] = [
    {neighborhood: 'Downtown Yonge East', openingYear: 2017},
    {neighborhood: 'South Riverdale', openingYear: 2017},
    {neighborhood: 'South Parkdale', openingYear: 2017},
    {neighborhood: 'Regent Park', openingYear: 2017},
    {neighborhood: 'Moss Park', openingYear: 2017},
    {neighborhood: 'West Queen West', openingYear: 2017}
];

export const isCTSSite = (neighborhoodName: string | undefined): boolean => {
    if (!neighborhoodName) return false;
    const normalizedName = neighborhoodName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return CTS_SITES.some((site) => {
        const normalizedSiteName = site.neighborhood.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSiteName === normalizedName;
    });
};

export const getCTSOpeningYear = (neighborhoodName: string | undefined): number | null => {
    if (!neighborhoodName) return null;
    const normalizedName = neighborhoodName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const site = CTS_SITES.find((site) => {
        const normalizedSiteName = site.neighborhood.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSiteName === normalizedName;
    });
    return site ? site.openingYear : null;
};

export const CONTROL_SITES: ControlSite[] = [
    {neighborhood: 'South Eglinton-Davisville'},
    {neighborhood: 'North Toronto'},
    {neighborhood: 'Dovercourt Village'},
    {neighborhood: 'Yonge-Bay Corridor'},
    {neighborhood: 'Black Creek'},
    {neighborhood: 'Pelmo Park-Humberlea'},
];

export const isControlSite = (neighborhoodName: string | undefined): boolean => {
    if (!neighborhoodName) return false;
    return CONTROL_SITES.some(site => site.neighborhood === neighborhoodName);
};

// Helper function to get neighborhood name from feature
export const getNeighborhoodName = (feature: CrimeFeature): string => {
    return feature.properties.AREA_NAME;
};

// Helper function to get crime count for a specific type and year
export const getCrimeCount = (feature: CrimeFeature, type: string, year: number): number => {
    const key = `${type}_${year}`;
    return feature.properties[key] as number || 0;
};