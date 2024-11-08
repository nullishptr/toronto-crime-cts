import {Building, Shield, TrendingDown, Users} from 'lucide-react';

interface ControlMetric {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
}

const controls: ControlMetric[] = [
    {
        title: "Demographic Factor",
        value: "0.82",
        description: "Population density normalized",
        icon: <Users className="w-6 h-6"/>
    },
    {
        title: "Economic Indicator",
        value: "1.15",
        description: "Relative to city average",
        icon: <TrendingDown className="w-6 h-6"/>
    },
    {
        title: "Facility Distance",
        value: "0.95",
        description: "Proximity score",
        icon: <Building className="w-6 h-6"/>
    },
    {
        title: "Historical Index",
        value: "0.78",
        description: "vs 5-year average",
        icon: <Shield className="w-6 h-6"/>
    }
];

export default function StatisticalControls() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {controls.map((metric) => (
                <div key={metric.title} className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="text-blue-600">{metric.icon}</div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">{metric.title}</h3>
                            <p className="text-2xl font-bold text-blue-900">{metric.value}</p>
                            <p className="text-xs text-gray-500">{metric.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}