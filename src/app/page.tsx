'use client';

import { useState } from 'react';

type Hotel = {
  name: string;
  location: string;
  price: string;
  rating: string;
};

const hotels: Hotel[] = [
  {
    name: 'Nairobi Grand Hotel',
    location: 'Nairobi, Kenya',
    price: '$120/night',
    rating: '4.5',
  },
  {
    name: 'Kampala Paradise Inn',
    location: 'Kampala, Uganda',
    price: '$95/night',
    rating: '4.2',
  },
  {
    name: 'Addis Royal Suites',
    location: 'Addis Ababa, Ethiopia',
    price: '$110/night',
    rating: '4.6',
  },
  {
    name: 'Dar Sea Breeze Hotel',
    location: 'Dar es Salaam, Tanzania',
    price: '$100/night',
    rating: '4.3',
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const match = hotels.find(
        (hotel) =>
          hotel.name.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase())
      );
      setResult(match || null);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col items-center justify-start">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        🏨 Hotel Price Predictor
      </h1>

      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search hotel or city..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 shadow-sm outline-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handlePredict}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Predict
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mt-6 text-blue-500 font-medium animate-pulse">
            🔍 Predicting hotel price...
          </p>
        )}

        {/* Result */}
        {!loading && result && (
          <div className="mt-6 border-t pt-4 space-y-2">
            <h2 className="text-2xl font-semibold text-blue-800">{result.name}</h2>
            <p className="text-gray-600">{result.location}</p>
            <p className="text-green-600 font-semibold text-lg">{result.price}</p>
            <p className="text-yellow-500">⭐ {result.rating}</p>
          </div>
        )}

        {/* Not Found */}
        {!loading && query && !result && (
          <p className="text-center mt-4 text-red-500">No matching hotel found.</p>
        )}
      </div>
    </main>
  );
}
