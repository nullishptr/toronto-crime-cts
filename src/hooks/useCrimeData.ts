import {useEffect, useState} from 'react';
import {CrimeData} from '../types/crimeData';

export const useCrimeData = () => {
    const [data, setData] = useState<CrimeData[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/neighbourhood_crime_rates.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((jsonData: CrimeData[]) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading JSON:', err);
                setError(err);
                setLoading(false);
            });
    }, []);

    return {data, error, loading};
};