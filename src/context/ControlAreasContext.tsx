import React, { createContext, useContext, useState, useCallback } from 'react';
import { CONTROL_SITES } from '../utils/crimeDataUtils';

interface ControlAreasContextType {
    selectedControls: { [key: string]: boolean };
    setSelectedControls: (controls: { [key: string]: boolean }) => void;
    toggleControl: (neighborhood: string) => void;
    selectAll: (neighborhoods: string[]) => void;
    clearAll: () => void;
}

const ControlAreasContext = createContext<ControlAreasContextType | undefined>(undefined);

export function ControlAreasProvider({ children }: { children: React.ReactNode }) {
    const [selectedControls, setSelectedControls] = useState<{ [key: string]: boolean}>(() => {
        // Initialize with default control sites
        return CONTROL_SITES.reduce((acc, site) => ({
            ...acc,
            [site.neighborhood]: true
        }), {});
    });

    const toggleControl = useCallback((neighborhood: string) => {
        setSelectedControls(prev => ({
            ...prev,
            [neighborhood]: !prev[neighborhood]
        }));
    }, []);

    const selectAll = useCallback((neighborhoods: string[]) => {
        setSelectedControls(prev => {
            const newSelection = { ...prev };
            neighborhoods.forEach(n => newSelection[n] = true);
            return newSelection;
        });
    }, []);

    const clearAll = useCallback(() => {
        setSelectedControls({});
    }, []);

    return (
        <ControlAreasContext.Provider value={{
            selectedControls,
            setSelectedControls,
            toggleControl,
            selectAll,
            clearAll
        }}>
            {children}
        </ControlAreasContext.Provider>
    );
}

export function useControlAreas() {
    const context = useContext(ControlAreasContext);
    if (context === undefined) {
        throw new Error('useControlAreas must be used within a ControlAreasProvider');
    }
    return context;
} 