import React from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {AlertTriangle, Shield, TrendingDown} from 'lucide-react';
import {ctsSites} from '../../utils/crimeDataUtils';

interface NeighborhoodDetailProps {
    name: string;
    isCTS: boolean;
}

export default function NeighborhoodDetail({name, isCTS}: NeighborhoodDetailProps) {
    // Generate yearly data from 2014 to 2023
    const yearlyData = Array.from({length: 10}, (_, i) => {
        const year = 2014 + i;
        return {
            year: year.toString(),
            violent: Math.floor(Math.random() * 100),
            property: Math.floor(Math.random() * 150),
            other: Math.floor(Math.random() * 50),
        };
    });

    const ctsYear = isCTS ? ctsSites[name as keyof typeof ctsSites] : null;

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                    {isCTS && (
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Shield className="w-4 h-4 mr-1"/>
              CTS Site (Opened {ctsYear})
            </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 mr-3"/>
                        <div>
                            <p className="text-sm text-gray-500">Violent Crime Rate</p>
                            <p className="text-2xl font-bold text-gray-900">45.2</p>
                            <p className="text-sm text-red-500">+5.2% vs last year</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <Shield className="w-8 h-8 text-blue-500 mr-3"/>
                        <div>
                            <p className="text-sm text-gray-500">Safety Score</p>
                            <p className="text-2xl font-bold text-gray-900">78/100</p>
                            <p className="text-sm text-green-500">+2.1% vs city average</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <TrendingDown className="w-8 h-8 text-green-500 mr-3"/>
                        <div>
                            <p className="text-sm text-gray-500">YoY Change</p>
                            <p className="text-2xl font-bold text-gray-900">-12.3%</p>
                            <p className="text-sm text-green-500">Improving trend</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={yearlyData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis
                            dataKey="year"
                            label={{value: 'Year', position: 'bottom', offset: 0}}
                        />
                        <YAxis
                            label={{value: 'Number of Incidents', angle: -90, position: 'insideLeft', offset: 10}}
                        />
                        <Tooltip/>
                        <Legend/>
                        <Bar dataKey="violent" name="Violent Crimes" fill="#ef4444"/>
                        <Bar dataKey="property" name="Property Crimes" fill="#3b82f6"/>
                        <Bar dataKey="other" name="Other Incidents" fill="#10b981"/>
                        {isCTS && ctsYear && (
                            <ReferenceLine
                                x={ctsYear.toString()}
                                stroke="#6495ED"
                                strokeWidth={2}
                                label={{
                                    value: 'CTS Opening',
                                    position: 'top',
                                    fill: '#6495ED',
                                    fontSize: 12
                                }}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}