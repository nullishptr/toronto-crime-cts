interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isIncrease: boolean;
    icon: React.ReactNode;
}

export default function StatCard({title, value, change, isIncrease, icon}: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <p className={`text-sm ${isIncrease ? 'text-red-600' : 'text-green-600'} flex items-center mt-1`}>
                        {change} vs last year
                    </p>
                </div>
                <div className="text-blue-600">
                    {icon}
                </div>
            </div>
        </div>
    );
}