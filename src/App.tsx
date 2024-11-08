import React, { useState, useEffect } from 'react';
import {Shield} from 'lucide-react';
import DifferenceInDifferences from './components/analysis/DifferenceInDifferences';
import IndexedComparison from './components/analysis/IndexedComparison';
import TrendAnalysis from './components/analysis/TrendAnalysis';
import NeighborhoodList from './components/neighborhoods/NeighborhoodList';
import {useCrimeData} from './hooks/useCrimeData';
import { ControlAreasProvider } from './context/ControlAreasContext';
import ControlAreaSelector from './components/controls/ControlAreaSelector';
import SpatialAnalysis from './components/analysis/SpatialAnalysis';

function App() {
    const {data: features, loading, error} = useCrimeData();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

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
        <ControlAreasProvider>
            <div className="min-h-screen bg-gray-50">
                <header className={`
                    sticky top-0 z-50 transition-all duration-200
                    ${scrolled 
                        ? 'bg-white/80 backdrop-blur-sm shadow-sm py-2' 
                        : 'bg-gradient-to-r from-blue-900 to-blue-800 py-3'
                    }
                `}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className={`
                                flex items-center space-x-3 transition-opacity duration-200
                                ${scrolled ? 'opacity-0 invisible h-0' : 'opacity-80 visible'}
                            `}>
                                <Shield className="w-6 h-6 text-white"/>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Toronto Safety Lens</h1>
                                    <p className="text-sm text-blue-200">Crime Statistics Dashboard</p>
                                </div>
                            </div>
                            {features && <ControlAreaSelector data={features} />}
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <SpatialAnalysis geoData={features} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <DifferenceInDifferences/>
                            <IndexedComparison/>
                        </div>
                        <TrendAnalysis/>
                        <NeighborhoodList features={features}/>
                    </div>
                </main>
            </div>
        </ControlAreasProvider>
    );
}

export default App;