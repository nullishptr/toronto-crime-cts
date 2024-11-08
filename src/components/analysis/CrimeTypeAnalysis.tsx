import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {CRIME_TYPES, isControlSite, isCTSSite} from '../../utils/crimeDataUtils';
import {useCrimeData} from '../../hooks/useCrimeData';

export default function CrimeTypeAnalysis() {
    const {data, loading, error} = useCrimeData();

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    const crimeTypeData = CRIME_TYPES.map(type => {
        const ctsTotal = data
            .filter(item => isCTSSite(item.NEIGHBOURHOOD_NAME))
            .reduce((sum, item) => sum + (item[`${type}_2023`] || 0), 0);

        const controlTotal = data
            .filter(item => isControlSite(item.NEIGHBOURHOOD_NAME))
            .reduce((sum, item) => sum + (item[`${type}_2023`] || 0), 0);

        return {
            type,
            ctsAreas: ctsTotal,
            controlAreas: controlTotal,
        };
    });

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Crime Type Distribution</h2>
            <p className="text-sm text-gray-600 mb-4">Comparison by crime category between CTS and control areas</p>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crimeTypeData} margin={{top: 10, right: 30, left: 10, bottom: 10}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="type" angle={-45} textAnchor="end" height={100}/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="ctsAreas" name="CTS Areas" fill="#DC143C"/>
                        <Bar dataKey="controlAreas" name="Control Areas" fill="#6495ED"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}