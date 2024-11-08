import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const data = [
    {month: 'Jan', incidents: 65},
    {month: 'Feb', incidents: 59},
    {month: 'Mar', incidents: 80},
    {month: 'Apr', incidents: 81},
    {month: 'May', incidents: 56},
    {month: 'Jun', incidents: 55},
    {month: 'Jul', incidents: 40},
];

export default function CrimeChart() {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Crime Trends</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DC143C" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#DC143C" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="month"/>
                        <YAxis/>
                        <Tooltip/>
                        <Area
                            type="monotone"
                            dataKey="incidents"
                            stroke="#DC143C"
                            fillOpacity={1}
                            fill="url(#colorIncidents)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}