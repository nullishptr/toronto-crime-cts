import React, {useState} from 'react';
import {Search} from 'lucide-react';
import NeighborhoodCard from './NeighborhoodCard';
import {isControlSite, isCTSSite} from '../../utils/crimeDataUtils';
import {CrimeData} from '../../types/crimeData';

// Define violent crime types with colors - moved here to be shared
export const VIOLENT_CRIMES = [
    { type: 'ASSAULT', color: '#ef4444', label: 'Assault' },    
    { type: 'BREAKENTER', color: '#3b82f6', label: 'Break & Enter' }, 
    { type: 'ROBBERY', color: '#10b981', label: 'Robbery' },    
    { type: 'SHOOTING', color: '#f59e0b', label: 'Shooting' }    
];

interface NeighborhoodListProps {
    features: CrimeData[];
}

export default function NeighborhoodList({features}: NeighborhoodListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'cts' | 'control'>('all');

    const filteredFeatures = features.filter(feature => {
        const name = feature.NEIGHBOURHOOD_NAME;
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filter === 'all'
                ? true
                : filter === 'cts'
                    ? isCTSSite(name)
                    : isControlSite(name);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Neighbourhood Analysis</h2>

                {/* Search and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search neighbourhoods..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('cts')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'cts'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            CTS Sites
                        </button>
                        <button
                            onClick={() => setFilter('control')}
                            className={`px-4 py-2 rounded-lg ${
                                filter === 'control'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Control Areas
                        </button>
                    </div>
                </div>

                {/* Global Legend */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Crime Types:</p>
                    <div className="flex flex-wrap gap-4">
                        {VIOLENT_CRIMES.map(({type, color, label}) => (
                            <div key={type} className="flex items-center">
                                <span 
                                    className="w-4 h-0.5 mr-2" 
                                    style={{backgroundColor: color}}
                                />
                                <span className="text-sm text-gray-600">{label}</span>
                            </div>
                        ))}
                        <div className="flex items-center">
                            <span 
                                className="w-4 h-0.5 mr-2 bg-gray-500" 
                                style={{borderTop: '1px dashed #6b7280'}}
                            />
                            <span className="text-sm text-gray-600">Total</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFeatures.map((feature) => (
                        <NeighborhoodCard
                            key={feature.NEIGHBOURHOOD_NAME}
                            feature={feature}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}