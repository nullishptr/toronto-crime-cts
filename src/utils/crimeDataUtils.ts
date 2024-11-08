export interface CTSSite {
    neighborhood: string;
    openingYear: number;
}


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

export interface CTSSite {
    neighborhood: string;
    openingYear: number;
}

export const CTS_SITES: CTSSite[] = [
    {neighborhood: 'Downtown Yonge East', openingYear: 2017},
    {neighborhood: 'South Riverdale', openingYear: 2017},
    {neighborhood: 'South Parkdale', openingYear: 2017},
    {neighborhood: 'Regent Park', openingYear: 2017},
    {neighborhood: 'Moss Park', openingYear: 2017},
    {neighborhood: 'West Queen West', openingYear: 2017}
];

export const isCTSSite = (neighborhoodName: string): boolean => {
    const normalizedName = neighborhoodName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return CTS_SITES.some((site) => {
        const normalizedSiteName = site.neighborhood.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSiteName === normalizedName;
    });
};

export const getCTSOpeningYear = (neighborhoodName: string): number | null => {
    const normalizedName = neighborhoodName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const site = CTS_SITES.find((site) => {
        const normalizedSiteName = site.neighborhood.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSiteName === normalizedName;
    });
    return site ? site.openingYear : null;
};


export interface ControlSite {
    neighborhood: string;
}

export const CONTROL_SITES: ControlSite[] = [
    {neighborhood: 'South Eglinton-Davisville'},
    {neighborhood: 'North Toronto'},
    {neighborhood: 'Dovercourt Village'},
    {neighborhood: 'Yonge-Bay Corridor'},
    {neighborhood: 'Black Creek'},
    {neighborhood: 'Pelmo Park-Humberlea'},
];

export const isControlSite = (neighborhoodName: string): boolean => {
    const normalizedName = neighborhoodName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    return CONTROL_SITES.some((site) => {
        const normalizedSiteName = site.neighborhood.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedSiteName === normalizedName;
    });
};