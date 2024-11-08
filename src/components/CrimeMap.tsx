import {MapPin} from 'lucide-react';

export default function CrimeMap() {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Neighborhood Map</h2>
                <MapPin className="text-blue-600 w-5 h-5"/>
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200"
                    alt="Toronto Cityscape"
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
        </div>
    );
}