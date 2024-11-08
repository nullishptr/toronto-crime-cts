import { Feature, Geometry } from 'geojson';

export interface CrimeProperties {
    OBJECTID_1: number;
    AREA_NAME: string;
    HOOD_158: number;
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
    BREAKENTER_2014: number;
    BREAKENTER_2015: number;
    BREAKENTER_2016: number;
    BREAKENTER_2017: number;
    BREAKENTER_2018: number;
    BREAKENTER_2019: number;
    BREAKENTER_2020: number;
    BREAKENTER_2021: number;
    BREAKENTER_2022: number;
    BREAKENTER_2023: number;
    ROBBERY_2014: number;
    ROBBERY_2015: number;
    ROBBERY_2016: number;
    ROBBERY_2017: number;
    ROBBERY_2018: number;
    ROBBERY_2019: number;
    ROBBERY_2020: number;
    ROBBERY_2021: number;
    ROBBERY_2022: number;
    ROBBERY_2023: number;
    SHOOTING_2014: number;
    SHOOTING_2015: number;
    SHOOTING_2016: number;
    SHOOTING_2017: number;
    SHOOTING_2018: number;
    SHOOTING_2019: number;
    SHOOTING_2020: number;
    SHOOTING_2021: number;
    SHOOTING_2022: number;
    SHOOTING_2023: number;
    [key: string]: number | string; // For dynamic access
}

export type CrimeFeature = Feature<Geometry, CrimeProperties>;

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