import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis
} from 'recharts';

const data = Array.from({length: 50}, (_, i) => ({
    distance: i * 0.2,
    crimeRate: 100 - Math.exp(-i * 0.2) * 25 + Math.random() * 10,
    size: Math.random() * 100
}));

export default function SpatialAnalysis() {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Spatial Analysis</h2>
            <p className="text-sm text-gray-600 mb-4">Crime rates by distance from special buildings</p>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="distance"
                            name="Distance (km)"
                            label={{value: 'Distance from Special Buildings (km)', position: 'bottom'}}
                        />
                        <YAxis
                            dataKey="crimeRate"
                            name="Crime Rate"
                            label={{value: 'Crime Rate', angle: -90, position: 'insideLeft'}}
                        />
                        <ZAxis dataKey="size" range={[50, 400]} name="Population"/>
                        <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                        <Legend/>
                        <Scatter
                            name="Neighborhood"
                            data={data}
                            fill="#DC143C"
                            opacity={0.5}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}