import React, { useState } from "react";

import { Search, CloudRain, X } from "lucide-react";

import WeatherChart from "./components/WeatherChart/WeatherChart";
import Spinner from "./components/Spinner/Spinner";
import { MetricType, Granularity } from "./types";
import { useCityManagement } from "./hooks/useCityManagement";

function App() {
  const [city, setCity] = useState("");
  const [metricType, setMetricType] = useState<MetricType>("temperature");
  const [granularity, setGranularity] = useState<Granularity>(
    Granularity.ThreeHours
  );

  const { cities, loading, error, addCity, removeCity } = useCityManagement();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCity(city);
      setCity("");
    } catch (err) {
      console.error("Error adding city", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <CloudRain className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? "Loading..." : "Search"}
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {cities.map((cityData) => (
              <div
                key={cityData.city}
                className="flex items-center gap-2 px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: cityData.color }}
              >
                <span>{cityData.city}</span>
                <button
                  onClick={() => removeCity(cityData.city)}
                  className="hover:bg-white/20 rounded-full p-1"
                  disabled={loading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {cities.length > 0 && (
            <div>
              <div className="flex gap-4 mb-6">
                <label className="sr-only" htmlFor="metric-type">
                  Metric Type
                </label>
                <select
                  id="metric-type"
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as MetricType)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="temperature">Temperature</option>
                  <option value="pressure">Pressure</option>
                  <option value="humidity">Humidity</option>
                  <option value="wind">Wind Speed</option>
                </select>

                <label className="sr-only" htmlFor="granularity">
                  Time Interval
                </label>
                <select
                  id="granularity"
                  value={granularity}
                  onChange={(e) =>
                    setGranularity(e.target.value as Granularity)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value={Granularity.ThreeHours}>
                    3 Hour Intervals
                  </option>
                  <option value={Granularity.Daily}>Daily Average</option>
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Spinner size="lg" />
                </div>
              ) : (
                <WeatherChart
                  cities={cities}
                  metricType={metricType}
                  granularity={granularity}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
