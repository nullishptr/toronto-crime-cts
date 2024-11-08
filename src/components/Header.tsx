import {Shield} from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-4">
                    <Shield className="w-10 h-10"/>
                    <div>
                        <h1 className="text-3xl font-bold">Toronto Safety Lens</h1>
                        <p className="text-blue-200">Neighborhood Crime Statistics Dashboard</p>
                    </div>
                </div>
            </div>
        </header>
    );
}