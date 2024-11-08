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
import {CRIME_TYPES, CTS_SITES, isControlSite} from '../../utils/crimeDataUtils';
import {CrimeData} from '../../types/crimeData';

interface YearlyDataPoint {
    year: number;
    ctsAreas: number;
    controlAreas: number;
    difference: number;
    relativeChange: number;
}

// Filter for violent crime types
const VIOLENT_CRIMES = CRIME_TYPES.filter(type =>
    ['ASSAULT', 'BREAKENTER', 'ROBBERY', 'SHOOTING'].includes(type)
);

export default function DifferenceInDifferences() {
    const {data, loading, error} = useCrimeData();
    const [yearlyData, setYearlyData] = useState<YearlyDataPoint[]>([]);

    useEffect(() => {
        if (loading || error || !data.length) return;

        // Filter for only 2017 CTS sites
        const cts2017Sites = CTS_SITES
            .filter(site => site.openingYear === 2017)
            .map(site => site.neighborhood);

        const ctsFeatures = data.filter((item: CrimeData) =>
            cts2017Sites.includes(item.NEIGHBOURHOOD_NAME)
        );
        const controlFeatures = data.filter((item: CrimeData) => isControlSite(item.NEIGHBOURHOOD_NAME));

        // Calculate baseline averages (2014-2016)
        const baselineYears = [2014, 2015, 2016];
        const calculateBaseline = (features: CrimeData[]) => {
            return features.reduce((acc, item) => {
                const baselineTotal = baselineYears.reduce((sum, year) => {
                    return sum + VIOLENT_CRIMES.reduce((crimeSum, crimeType) => {
                        return crimeSum + (item[`${crimeType}_${year}`] || 0);
                    }, 0);
                }, 0);
                return acc + (baselineTotal / baselineYears.length);
            }, 0) / features.length;
        };

        const ctsBaseline = calculateBaseline(ctsFeatures);
        const controlBaseline = calculateBaseline(controlFeatures);

        // First pass: Generate yearly data without relativeChange
        const initialYearlyStats: YearlyDataPoint[] = Array.from({length: 10}, (_, i) => {
            const year = 2014 + i;

            // Calculate yearly averages
            const ctsAverage = ctsFeatures.reduce((acc, item) => {
                return acc + VIOLENT_CRIMES.reduce((crimeSum, crimeType) => {
                    return crimeSum + (item[`${crimeType}_${year}`] || 0);
                }, 0);
            }, 0) / ctsFeatures.length;

            const controlAverage = controlFeatures.reduce((acc, item) => {
                return acc + VIOLENT_CRIMES.reduce((crimeSum, crimeType) => {
                    return crimeSum + (item[`${crimeType}_${year}`] || 0);
                }, 0);
            }, 0) / controlFeatures.length;

            // Calculate normalized values (relative to baseline)
            const ctsNormalized = (ctsAverage / ctsBaseline) * 100;
            const controlNormalized = (controlAverage / controlBaseline) * 100;

            // Calculate the difference between treatment and control
            const difference = ctsNormalized - controlNormalized;

            return {
                year,
                ctsAreas: Math.round(ctsNormalized * 10) / 10,
                controlAreas: Math.round(controlNormalized * 10) / 10,
                difference: Math.round(difference * 10) / 10,
                relativeChange: 0 // Placeholder, to be updated in the second pass
            };
        });

        // Second pass: Calculate relativeChange
        const finalYearlyStats: YearlyDataPoint[] = initialYearlyStats.map((dataPoint, index, arr) => {
            if (dataPoint.year >= 2017) {
                const baselineDifference = arr.find(item => item.year === 2017)?.difference || 0;
                return {
                    ...dataPoint,
                    relativeChange: Math.round((dataPoint.difference - baselineDifference) * 10) / 10
                };
            }
            return dataPoint;
        });

        setYearlyData(finalYearlyStats);
    }, [data, loading, error]);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;
    if (!yearlyData.length) return <div>No data available.</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Difference-in-Differences Analysis: Violent Crime Trends Relative to 2014-2016 Baseline
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Comparing violent crime rates in 2017 CTS sites vs control areas (normalized to pre-treatment baseline)
            </p>
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={yearlyData}
                        margin={{top: 20, right: 30, left: 10, bottom: 10}}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5"/>
                        <XAxis
                            dataKey="year"
                            stroke="#666"
                            tick={{fontSize: 12}}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{fontSize: 12}}
                            label={{
                                value: 'Percent of Baseline (2014-2016 = 100)',
                                angle: -90,
                                position: 'insideLeft',
                                style: {fontSize: '12px'}
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                            formatter={(value: number) => [`${value}%`, '']}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                        />
                        <ReferenceLine
                            x={2017}
                            stroke="#6495ED"
                            strokeWidth={2}
                            label={{
                                value: 'CTS Implementation',
                                position: 'top',
                                fill: '#6495ED',
                                fontSize: 12
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="ctsAreas"
                            name="CTS Areas (2017)"
                            stroke="#DC143C"
                            strokeWidth={2.5}
                            dot={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="controlAreas"
                            name="Control Areas"
                            stroke="#6495ED"
                            strokeWidth={2.5}
                            dot={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="relativeChange"
                            name="Relative Difference"
                            stroke="#059669"
                            strokeWidth={2.5}
                            dot={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                <p>Notes:</p>
                <ul className="list-disc list-inside">
                    <li>Values are normalized to pre-treatment period (2014-2016 average = 100)</li>
                    <li>Includes violent crimes: {VIOLENT_CRIMES.join(', ').toLowerCase()}</li>
                    <li>Relative Difference shows the treatment effect after accounting for pre-existing trends</li>
                    <li>Negative values indicate better outcomes in CTS areas relative to control areas</li>
                </ul>
            </div>
        </div>
    );
}