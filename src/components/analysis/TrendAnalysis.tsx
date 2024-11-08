import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

interface TrendData {
    year: number;
    ctsDiff: number;
    controlDiff: number;
}

// Linear regression helper function
const linearRegression = (years: number[], values: number[]) => {
    const n = years.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;

    for (let i = 0; i < n; i++) {
        sum_x += years[i];
        sum_y += values[i];
        sum_xy += years[i] * values[i];
        sum_xx += years[i] * years[i];
    }

    const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    const intercept = (sum_y - slope * sum_x) / n;

    return years.map(year => slope * year + intercept);
};

const calculateTrendAnalysis = (
    ctsFeatures: any[],
    controlFeatures: any[]
): TrendData[] => {
    const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

    // Calculate yearly totals for each group
    const ctsTotals = years.map(year =>
        ctsFeatures.reduce((total, feature) =>
                total + VIOLENT_CRIMES.reduce((sum, type) =>
                    sum + (feature[`${type}_${year}`] || 0), 0
                ), 0
        )
    );

    const controlTotals = years.map(year =>
        controlFeatures.reduce((total, feature) =>
                total + VIOLENT_CRIMES.reduce((sum, type) =>
                    sum + (feature[`${type}_${year}`] || 0), 0
                ), 0
        )
    );

    // Calculate trends using linear regression
    const ctsTrend = linearRegression(years, ctsTotals);
    const controlTrend = linearRegression(years, controlTotals);

    // Calculate differences from trend
    return years.map((year, index) => ({
        year,
        ctsDiff: Number((ctsTotals[index] - ctsTrend[index]).toFixed(1)),
        controlDiff: Number((controlTotals[index] - controlTrend[index]).toFixed(1))
    }));
};

export default function TrendAnalysis() {
    const {data, loading, error} = useCrimeData();
    const [trendData, setTrendData] = useState<TrendData[]>([]);

    useEffect(() => {
        if (loading || error || !data.length) return;

        const ctsFeatures = data.filter((item: CrimeData) => isCTSSite(item.NEIGHBOURHOOD_NAME));
        const controlFeatures = data.filter((item: CrimeData) => isControlSite(item.NEIGHBOURHOOD_NAME));

        const trends = calculateTrendAnalysis(ctsFeatures, controlFeatures);
        setTrendData(trends);
    }, [data, loading, error]);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;
    if (!trendData.length) return <div>No data available.</div>;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Violent Crime Trend Analysis
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Differences from expected linear trend for CTS and control areas
            </p>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={trendData}
                        margin={{top: 20, right: 30, left: 10, bottom: 10}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="year"
                            stroke="#666"
                            tick={{fontSize: 12}}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{fontSize: 12}}
                            label={{
                                value: 'Difference from Expected Trend',
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
                            formatter={(value: number) => [value.toFixed(1), '']}
                        />
                        <Legend/>
                        <ReferenceLine
                            y={0}
                            stroke="#666"
                            strokeDasharray="3 3"
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
                        <Bar
                            dataKey="ctsDiff"
                            name="CTS Areas"
                            fill="#DC143C"
                        />
                        <Bar
                            dataKey="controlDiff"
                            name="Control Areas"
                            fill="#6495ED"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>Notes:</p>
                <ul className="list-disc list-inside">
                    <li>Bars show deviations from the expected linear trend</li>
                    <li>Includes violent crimes: {VIOLENT_CRIMES.join(', ').toLowerCase()}</li>
                    <li>Positive values indicate higher than expected crime levels</li>
                    <li>Negative values indicate lower than expected crime levels</li>
                    <li>CTS implementation began in 2017</li>
                </ul>
            </div>
        </div>
    );
}