import React from 'react';
import {Shield} from 'lucide-react';
import DifferenceInDifferences from './components/analysis/DifferenceInDifferences';
import IndexedComparison from './components/analysis/IndexedComparison';
import TrendAnalysis from './components/analysis/TrendAnalysis';
import NeighborhoodList from './components/neighborhoods/NeighborhoodList';
import {useCrimeData} from './hooks/useCrimeData';

function App() {
    const {data: features, loading, error} = useCrimeData();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading crime data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl">{error.message}</p>
                    <p className="mt-2">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center space-x-4">
                    <Shield className="w-10 h-10"/>
                    <div>
                        <h1 className="text-3xl font-bold">Toronto Safety Lens</h1>
                        <p className="text-blue-200">Neighbourhood Crime Statistics Dashboard</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DifferenceInDifferences/>
                        <IndexedComparison/>
                    </div>
                    <TrendAnalysis/>
                    <NeighborhoodList features={features}/>
                </div>
            </main>
        </div>
    );
}

export default App;