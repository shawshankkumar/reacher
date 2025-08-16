import React from 'react';
import { City } from '../types';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface CitySelectorProps {
  cities: City[];
  onSelectCity: (city: City) => void;
  isLoading: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({ cities, onSelectCity, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading cities...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">Choose a City</h1>
      <div className="grid gap-4">
        {cities.map((city) => (
          <motion.button
            key={city.id}
            className="bg-white border-2 border-blue-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all flex items-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCity(city)}
          >
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-lg text-gray-800">{city.name}</h2>
              <p className="text-sm text-gray-500">{city.questions.length} questions</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CitySelector;