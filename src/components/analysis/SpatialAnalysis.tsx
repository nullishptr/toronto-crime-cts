import React, { useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useControlAreas } from '../../context/ControlAreasContext';
import { isCTSSite } from '../../utils/crimeDataUtils';
import { Feature, Geometry } from 'geojson';
import { getNeighborhoodCentroid, calculateDistance, assignDistanceZone, ZoneStats } from '../../utils/spatialUtils';
import 'leaflet/dist/leaflet.css';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    Legend as RechartsLegend, 
    ResponsiveContainer 
} from 'recharts';

interface SpatialAnalysisProps {
    geoData: Feature<Geometry>[];
}

interface CrimeComparison {
    crimeType: string;
    nearCTS: number;
    otherAreas: number;
    percentDifference: number;
    changeNearCTS: number;    // % change since 2016
    changeOtherAreas: number; // % change since 2016
}

export default function SpatialAnalysis({ geoData }: SpatialAnalysisProps) {
    const { selectedControls } = useControlAreas();

    const getNeighborhoodColor = (feature: Feature) => {
        const name = feature.properties?.AREA_NAME;
        if (isCTSSite(name)) {
            return '#DC143C';
        }
        if (selectedControls[name]) {
            return '#6495ED';
        }
        return '#E5E7EB';
    };

    const getNeighborhoodStyle = (feature: Feature) => {
        const name = feature.properties?.AREA_NAME;
        if (isCTSSite(name)) {
            return {
                fillColor: '#DC143C',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        // Calculate distance to nearest CTS site
        const neighborhoodCenter = getNeighborhoodCentroid(feature);
        let minDistance = Infinity;
        
        geoData.forEach(otherFeature => {
            if (isCTSSite(otherFeature.properties?.AREA_NAME)) {
                const ctsCentroid = getNeighborhoodCentroid(otherFeature);
                const distance = calculateDistance(neighborhoodCenter, ctsCentroid);
                minDistance = Math.min(minDistance, distance);
            }
        });

        const zoneId = assignDistanceZone(minDistance);
        const colors = ['#ff9999', '#ffcc99', '#99ff99', '#9999ff'];
        
        return {
            fillColor: colors[zoneId],
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    // Calculate total violent crimes for 2023
    const getViolentCrimeTotal = (properties: any) => {
        return ['ASSAULT', 'BREAKENTER', 'ROBBERY', 'SHOOTING']
            .reduce((sum, type) => sum + (properties[`${type}_2023`] || 0), 0);
    };

    const onEachFeature = (feature: Feature, layer: any) => {
        const props = feature.properties;
        if (props) {
            const total = getViolentCrimeTotal(props);
            layer.bindTooltip(`
                <div class="font-sans">
                    <strong>${props.AREA_NAME}</strong><br/>
                    2023 Violent Crimes: ${total}
                </div>
            `, {
                permanent: false,
                direction: 'top'
            });
        }
    };

    // Calculate bounds for the map
    const bounds = useMemo(() => {
        if (!geoData.length) return undefined;
        
        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        geoData.forEach(feature => {
            const coords = feature.geometry.coordinates[0];
            coords.forEach(([lng, lat]) => {
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
            });
        });

        return [[minLat, minLng], [maxLat, maxLng]];
    }, [geoData]);

    const zoneAnalysis = useMemo(() => {
        const ctsSites = geoData.filter(feature => 
            isCTSSite(feature.properties?.AREA_NAME));
        
        const zoneData: ZoneStats[] = Array(4).fill(null).map((_, i) => ({
            zoneId: i,
            avgCrimeRate: 0,
            neighborhoodCount: 0,
            description: i < 3 ? `${i}-${i+1}km from CTS` : '>3km from CTS'
        }));

        const nonCTSNeighborhoods = geoData.filter(feature => 
            !isCTSSite(feature.properties?.AREA_NAME));

        nonCTSNeighborhoods.forEach(neighborhood => {
            const neighborhoodCenter = getNeighborhoodCentroid(neighborhood);
            
            // Find minimum distance to any CTS site
            let minDistance = Infinity;
            ctsSites.forEach(ctsSite => {
                const ctsCentroid = getNeighborhoodCentroid(ctsSite);
                const distance = calculateDistance(neighborhoodCenter, ctsCentroid);
                minDistance = Math.min(minDistance, distance);
            });

            const zoneId = assignDistanceZone(minDistance);
            const crimeRate = getViolentCrimeTotal(neighborhood.properties);

            zoneData[zoneId].avgCrimeRate += crimeRate;
            zoneData[zoneId].neighborhoodCount += 1;
        });

        // Calculate averages
        zoneData.forEach(zone => {
            if (zone.neighborhoodCount > 0) {
                zone.avgCrimeRate = zone.avgCrimeRate / zone.neighborhoodCount;
            }
        });

        return zoneData;
    }, [geoData]);

    const crimeComparison = useMemo(() => {
        const crimeTypes = ['ASSAULT', 'ROBBERY', 'BREAKENTER', 'SHOOTING'];
        const nearThreshold = 2; // Consider "near" as within 2km

        const comparisons: CrimeComparison[] = crimeTypes.map(crimeType => {
            let near2023Sum = 0;
            let near2016Sum = 0;
            let nearCount = 0;
            let other2023Sum = 0;
            let other2016Sum = 0;
            let otherCount = 0;

            geoData.forEach(neighborhood => {
                if (isCTSSite(neighborhood.properties?.AREA_NAME)) {
                    return; // Skip CTS sites themselves
                }

                // Calculate distance to nearest CTS site
                const neighborhoodCenter = getNeighborhoodCentroid(neighborhood);
                let minDistance = Infinity;
                
                geoData.forEach(otherFeature => {
                    if (isCTSSite(otherFeature.properties?.AREA_NAME)) {
                        const ctsCentroid = getNeighborhoodCentroid(otherFeature);
                        const distance = calculateDistance(neighborhoodCenter, ctsCentroid);
                        minDistance = Math.min(minDistance, distance);
                    }
                });

                const crime2023 = neighborhood.properties?.[`${crimeType}_2023`] || 0;
                const crime2016 = neighborhood.properties?.[`${crimeType}_2016`] || 0;
                
                if (minDistance <= nearThreshold) {
                    near2023Sum += crime2023;
                    near2016Sum += crime2016;
                    nearCount++;
                } else {
                    other2023Sum += crime2023;
                    other2016Sum += crime2016;
                    otherCount++;
                }
            });

            const nearAvg2023 = nearCount > 0 ? near2023Sum / nearCount : 0;
            const nearAvg2016 = nearCount > 0 ? near2016Sum / nearCount : 0;
            const otherAvg2023 = otherCount > 0 ? other2023Sum / otherCount : 0;
            const otherAvg2016 = otherCount > 0 ? other2016Sum / otherCount : 0;

            const percentDifference = otherAvg2023 > 0 
                ? ((nearAvg2023 - otherAvg2023) / otherAvg2023) * 100 
                : 0;

            const changeNearCTS = nearAvg2016 > 0
                ? ((nearAvg2023 - nearAvg2016) / nearAvg2016) * 100
                : 0;

            const changeOtherAreas = otherAvg2016 > 0
                ? ((otherAvg2023 - otherAvg2016) / otherAvg2016) * 100
                : 0;

            return {
                crimeType: crimeType.charAt(0) + crimeType.slice(1).toLowerCase(),
                nearCTS: Math.round(nearAvg2023 * 10) / 10,
                otherAreas: Math.round(otherAvg2023 * 10) / 10,
                percentDifference: Math.round(percentDifference),
                changeNearCTS: Math.round(changeNearCTS),
                changeOtherAreas: Math.round(changeOtherAreas)
            };
        });

        return comparisons;
    }, [geoData]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Spatial Distribution of Violent Crime
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Geographic analysis of violent crime across Toronto neighborhoods
            </p>

            <div className="h-[600px] rounded-lg overflow-hidden">
                <MapContainer
                    bounds={bounds as L.LatLngBoundsExpression}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                        data={{
                            type: 'FeatureCollection',
                            features: geoData
                        }}
                        style={getNeighborhoodStyle}
                        onEachFeature={onEachFeature}
                    />
                </MapContainer>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Distance-Based Analysis</h3>
                <div className="grid grid-cols-4 gap-4">
                    {zoneAnalysis.map((zone) => (
                        <div key={zone.zoneId} className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium">{zone.description}</h4>
                            <p className="text-sm text-gray-600">
                                Avg. Violent Crimes: {zone.avgCrimeRate.toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-500">
                                Neighborhoods: {zone.neighborhoodCount}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">
                    Crime Rate Comparison & Trends (2016-2023)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Comparing crime rates between areas near CTS sites (within 2km) and other neighborhoods. 
                    Changes are measured from 2016 (pre-CTS) to 2023. 
                    <span className="text-red-500">Red</span> indicates an increase, 
                    <span className="text-green-500">green</span> indicates a decrease.
                </p>
                <div className="grid grid-cols-1 gap-6">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={crimeComparison}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="crimeType" />
                                <YAxis label={{ value: 'Average Incidents (2023)', angle: -90, position: 'insideLeft' }} />
                                <RechartsTooltip 
                                    formatter={(value: number, name: string) => {
                                        return [value.toFixed(1), name === 'nearCTS' ? 'Near CTS (≤2km)' : 'Other Areas'];
                                    }}
                                />
                                <RechartsLegend />
                                <Bar 
                                    name="Near CTS (≤2km)" 
                                    dataKey="nearCTS" 
                                    fill="#ff9999" 
                                />
                                <Bar 
                                    name="Other Areas" 
                                    dataKey="otherAreas" 
                                    fill="#9999ff" 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {/* Reorganized comparison table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Crime Type
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200" colSpan={2}>
                                        Near CTS Sites (≤2km)
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200" colSpan={2}>
                                        Other Areas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200">
                                        Comparison
                                    </th>
                                </tr>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider border-l border-gray-200">
                                        2023 Avg
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Change from 2016
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider border-l border-gray-200">
                                        2023 Avg
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Change from 2016
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider border-l border-gray-200">
                                        Current Difference
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {crimeComparison.map((item) => (
                                    <tr key={item.crimeType} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.crimeType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-l border-gray-200">
                                            {item.nearCTS.toFixed(1)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            item.changeNearCTS > 0 ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                            {item.changeNearCTS > 0 ? '+' : ''}{item.changeNearCTS}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-l border-gray-200">
                                            {item.otherAreas.toFixed(1)}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            item.changeOtherAreas > 0 ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                            {item.changeOtherAreas > 0 ? '+' : ''}{item.changeOtherAreas}%
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            item.percentDifference > 0 ? 'text-red-500' : 'text-green-500'
                                        } border-l border-gray-200`}>
                                            {item.percentDifference > 0 ? '+' : ''}{item.percentDifference}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan={6} className="px-6 py-3 text-xs text-gray-500">
                                        * Current Difference shows how much higher/lower crime rates are in near-CTS areas compared to other areas in 2023
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}