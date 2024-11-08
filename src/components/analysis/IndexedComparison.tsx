import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {useCrimeData} from '../../hooks/useCrimeData';
import {useEffect, useState} from 'react';
import {CRIME_TYPES, isControlSite, isCTSSite} from '../../utils/crimeDataUtils';
import {CrimeData} from '../../types/crimeData';

// Filter for violent crime types
const VIOLENT_CRIMES = CRIME_TYPES.filter(type =>
    ['ASSAULT', 'BREAKENTER', 'ROBBERY', 'SHOOTING'].includes(type)
);

interface IndexedData {
    year: number;
    ctsIndex: number;
    controlIndex: number;
}

const calculateIndexedTrends = (
    ctsFeatures: any[],
    controlFeatures: any[],
    baselineYear: number = 2016 // Year before intervention
): IndexedData[] => {
    const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    // Calculate baseline values (2016)
    const ctsBaseline = ctsFeatures.reduce((total, feature) => {
        return total + VIOLENT_CRIMES.reduce((sum, type) => {
            return sum + (feature[`${type}_${baselineYear}`] || 0);
        }, 0);
    }, 0);

    const controlBaseline = controlFeatures.reduce((total, feature) => {
        return total + VIOLENT_CRIMES.reduce((sum, type) => {
            return sum + (feature[`${type}_${baselineYear}`] || 0);
        }, 0);
    }, 0);

    // Calculate indexed values for each year
    return years.map(year => {
        const ctsCrimes = ctsFeatures.reduce((total, feature) => {
            return total + VIOLENT_CRIMES.reduce((sum, type) => {
                return sum + (feature[`${type}_${year}`] || 0);
            }, 0);
        }, 0);

        const controlCrimes = controlFeatures.reduce((total, feature) => {
            return total + VIOLENT_CRIMES.reduce((sum, type) => {
                return sum + (feature[`${type}_${year}`] || 0);
            }, 0);
        }, 0);

        return {
            year,
            ctsIndex: Number(((ctsCrimes / ctsBaseline) * 100).toFixed(1)),
            controlIndex: Number(((controlCrimes / controlBaseline) * 100).toFixed(1))
        };
    });
};

export default function IndexedTrendAnalysis() {
    const {data, loading, error} = useCrimeData();
    const [indexedData, setIndexedData] = useState<IndexedData[]>([]);

    useEffect(() => {
        if (loading || error || !data.length) return;

        const ctsFeatures = data.filter((item: CrimeData) => isCTSSite(item.NEIGHBOURHOOD_NAME));
        const controlFeatures = data.filter((item: CrimeData) => isControlSite(item.NEIGHBOURHOOD_NAME));

        const trends = calculateIndexedTrends(ctsFeatures, controlFeatures);
        setIndexedData(trends);
    }, [data, loading, error]);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;
    if (!indexedData.length) return <div>No data available.</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Indexed Violent Crime Trends (2016 = 100)
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Comparing violent crime trends in CTS and control areas relative to 2016 levels
            </p>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={indexedData}
                        margin={{top: 10, right: 30, left: 10, bottom: 10}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="year"
                            tickFormatter={(year) => String(year)}
                        />
                        <YAxis
                            domain={[80, 140]}
                            ticks={[80, 90, 100, 110, 120, 130, 140]}
                            label={{
                                value: 'Index (2016 = 100)',
                                angle: -90,
                                position: 'insideLeft',
                                style: {textAnchor: 'middle'}
                            }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value}`, '']}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                        <Legend/>
                        <ReferenceLine
                            y={100}
                            stroke="#666"
                            strokeDasharray="3 3"
                            label={{
                                value: '2016 Baseline',
                                position: 'right',
                                fill: '#666',
                                fontSize: 12
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="ctsIndex"
                            name="CTS Areas"
                            stroke="#DC143C"
                            strokeWidth={2}
                            dot={{r: 4}}
                            activeDot={{r: 6}}
                        />
                        <Line
                            type="monotone"
                            dataKey="controlIndex"
                            name="Control Areas"
                            stroke="#6495ED"
                            strokeWidth={2}
                            dot={{r: 4}}
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>Notes:</p>
                <ul className="list-disc list-inside">
                    <li>2016 used as baseline year (index = 100)</li>
                    <li>Includes violent crimes: {VIOLENT_CRIMES.join(', ').toLowerCase()}</li>
                    <li>Values above 100 indicate increases relative to 2016</li>
                    <li>Values below 100 indicate decreases relative to 2016</li>
                    <li>CTS implementation began in 2017</li>
                </ul>
            </div>
        </div>
    );
}