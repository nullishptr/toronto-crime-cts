import React from 'react';
import {MapPin, Shield, TrendingDown, TrendingUp} from 'lucide-react';
import {Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {getCTSOpeningYear, isControlSite, isCTSSite} from '../../utils/crimeDataUtils';
import {CrimeData} from '../../types/crimeData';

interface NeighborhoodCardProps {
    feature: CrimeData;
}

export default function NeighborhoodCard({feature}: NeighborhoodCardProps) {
    const neighborhoodName = feature.NEIGHBOURHOOD_NAME;
    const ctsOpeningYear = getCTSOpeningYear(neighborhoodName);
    const isCTS = isCTSSite(neighborhoodName);
    const isControl = isControlSite(neighborhoodName);

    // Generate yearly data from 2014 to 2023
    const yearlyData = Array.from({length: 10}, (_, i) => {
        const year = 2014 + i;
        return {
            year,
            count: feature[`ASSAULT_${year}`] || 0,
        };
    });

    const latestYear = yearlyData[yearlyData.length - 1];
    const previousYear = yearlyData[yearlyData.length - 2];
    const yearOverYearChange = ((latestYear.count - previousYear.count) / previousYear.count) * 100;

    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {neighborhoodName}
                        {isCTS && (
                            <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Shield className="w-4 h-4 mr-1 text-red-800"/>
                CTS
              </span>
                        )}
                        {isControl && (
                            <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Shield className="w-4 h-4 mr-1 text-blue-800"/>
                Control
              </span>
                        )}
                    </h3>
                    <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1"/>
                        <span className="text-sm text-gray-500">Toronto, ON</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-3xl font-bold text-gray-900">
                        {latestYear.count}
                    </p>
                    <p className="text-sm text-gray-500">Total Incidents</p>
                </div>
                <div className={`flex items-center ${
                    yearOverYearChange > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                    {yearOverYearChange > 0 ? (
                        <TrendingUp className="h-5 w-5 mr-1"/>
                    ) : (
                        <TrendingDown className="h-5 w-5 mr-1"/>
                    )}
                    <span className="font-semibold">
            {Math.abs(yearOverYearChange).toFixed(1)}%
          </span>
                </div>
            </div>

            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyData}>
                        <XAxis
                            dataKey="year"
                            tick={{fontSize: 12}}
                            interval={1}
                        />
                        <YAxis hide/>
                        {ctsOpeningYear && (
                            <ReferenceLine
                                x={ctsOpeningYear}
                                stroke="red"
                                strokeDasharray="3 3"
                                label={{
                                    value: 'CTS Opening',
                                    position: 'top',
                                    fill: 'red',
                                    fontSize: 12,
                                    dy: -10,
                                }}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#6495ED"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}