import { Feature, Point, Position } from 'geojson';
import * as turf from '@turf/turf';

export function getNeighborhoodCentroid(feature: Feature): Position {
    const polygon = turf.polygon(feature.geometry.coordinates);
    const centroid = turf.centroid(polygon);
    return centroid.geometry.coordinates;
}

export function calculateDistance(point1: Position, point2: Position): number {
    const from = turf.point(point1);
    const to = turf.point(point2);
    // Returns distance in kilometers
    return turf.distance(from, to);
}

export function assignDistanceZone(distance: number): number {
    if (distance <= 1) return 0; // 0-1km zone
    if (distance <= 2) return 1; // 1-2km zone
    if (distance <= 3) return 2; // 2-3km zone
    return 3; // >3km zone
}

export interface ZoneStats {
    zoneId: number;
    avgCrimeRate: number;
    neighborhoodCount: number;
    description: string;
} 