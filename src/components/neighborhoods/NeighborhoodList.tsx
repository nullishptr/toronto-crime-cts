import React, {useState} from 'react';
import {Search} from 'lucide-react';
import NeighborhoodCard from './NeighborhoodCard';
import {isControlSite, isCTSSite} from '../../utils/crimeDataUtils';
import {CrimeData} from '../../types/crimeData';

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