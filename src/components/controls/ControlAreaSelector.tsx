import React, { useState, useRef, useEffect } from 'react';
import { Command } from 'cmdk';
import { CrimeFeature } from '../../types/crimeData';
import { isCTSSite, CONTROL_SITES, getNeighborhoodName } from '../../utils/crimeDataUtils';
import { useControlAreas } from '../../context/ControlAreasContext';
import { X, Check, ChevronDown, Search } from 'lucide-react';

interface ControlAreaSelectorProps {
    data: CrimeFeature[];
}

export default function ControlAreaSelector({ data }: ControlAreaSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const { selectedControls, toggleControl, selectAll, clearAll } = useControlAreas();

    // Get all non-CTS neighborhoods
    const potentialControlAreas = React.useMemo(() => {
        const areas = data
            .filter(feature => !isCTSSite(feature.properties.AREA_NAME))
            .map(feature => feature.properties.AREA_NAME)
            .sort();

        // Sort so default control sites appear first
        return areas.sort((a, b) => {
            const aIsDefault = CONTROL_SITES.some(site => site.neighborhood === a);
            const bIsDefault = CONTROL_SITES.some(site => site.neighborhood === b);
            if (aIsDefault && !bIsDefault) return -1;
            if (!aIsDefault && bIsDefault) return 1;
            return a.localeCompare(b);
        });
    }, [data]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCount = Object.values(selectedControls).filter(Boolean).length;

    return (
        <div ref={ref} className="relative w-full max-w-[600px]">
            <div 
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-4 py-2 bg-white/90 backdrop-blur-sm border rounded-lg shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                        Control Areas
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                        {selectedCount} selected
                    </span>
                </div>
                <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`}
                />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border animate-in fade-in-0 zoom-in-95">
                    <Command className="w-full">
                        <div className="flex items-center border-b px-3">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Command.Input 
                                value={search}
                                onValueChange={setSearch}
                                className="w-full py-3 px-2 text-sm outline-none placeholder:text-gray-400"
                                placeholder="Search neighborhoods..."
                            />
                        </div>
                        <Command.List className="max-h-[300px] overflow-y-auto p-2">
                            <div className="flex items-center justify-between px-2 py-1.5">
                                <span className="text-xs text-gray-500 font-medium">
                                    {search ? 'Search Results' : 'Default Control Areas'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => selectAll(potentialControlAreas)}
                                        className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="text-xs text-gray-600 hover:text-gray-700"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>
                            {potentialControlAreas
                                .filter(area => area.toLowerCase().includes(search.toLowerCase()))
                                .map((area) => (
                                    <Command.Item
                                        key={area}
                                        onSelect={() => toggleControl(area)}
                                        className="flex items-center px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                                    >
                                        <div className="flex items-center flex-1">
                                            <div className={`
                                                flex h-4 w-4 items-center justify-center rounded-sm border
                                                ${selectedControls[area] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                                            `}>
                                                {selectedControls[area] && (
                                                    <Check className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                            <span className="ml-2 text-sm text-gray-700">
                                                {area}
                                            </span>
                                        </div>
                                        {CONTROL_SITES.some(site => site.neighborhood === area) && (
                                            <span className="text-xs text-gray-400">Default</span>
                                        )}
                                    </Command.Item>
                                ))}
                        </Command.List>
                    </Command>
                </div>
            )}
        </div>
    );
} 