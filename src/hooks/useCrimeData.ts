import { useEffect, useState } from 'react';
import { Feature } from 'geojson';

export const useCrimeData = () => {
    const [data, setData] = useState<Feature[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL;
        const jsonUrl = `${baseUrl}Geo_Neighbourhood_Crime_Rates_Open_Data.geojson`;

        fetch(jsonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((geoJson) => {
                setData(geoJson.features);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading GeoJSON:', err);
                setError(err);
                setLoading(false);
            });
    }, []);

    return { data, error, loading };
};