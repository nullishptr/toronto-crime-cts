export interface CrimeData {
    OBJECTID_1: number;
    NEIGHBOURHOOD_NAME: string;
    HOOD_158: number;

    [key: string]: number | string;
}

export interface NeighborhoodProperties {
    AREA_NAME: string;
    ASSAULT_2014: number;
    ASSAULT_2015: number;
    ASSAULT_2016: number;
    ASSAULT_2017: number;
    ASSAULT_2018: number;
    ASSAULT_2019: number;
    ASSAULT_2020: number;
    ASSAULT_2021: number;
    ASSAULT_2022: number;
    ASSAULT_2023: number;
    AUTOTHEFT_2023: number;
    BIKETHEFT_2023: number;
    BREAKENTER_2023: number;
    ROBBERY_2023: number;
    SHOOTING_2023: number;
    THEFTFROMMV_2023: number;
    THEFTOVER_2023: number;
}

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
    {neighborhood: 'West Queen West', openingYear: 2017},
];

export interface SeasonalPattern {
    month: string;
    ctsPrePattern: number;
    ctsPostPattern: number;
    controlPrePattern: number;
    controlPostPattern: number;
    ctsPatternChange: number;
    controlPatternChange: number;
}

export interface MonthlyPattern {
    month: string;
    crimeCount: number;
    yearCount: number;
}