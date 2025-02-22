import { useState, useCallback } from "react";

import { CITY_COLORS } from "../../constants";
import { CityWeather } from "../../types";
import { getCoordinates, getWeatherForecast } from "../../api/weather";

interface UseCityManagementReturn {
  cities: CityWeather[];
  loading: boolean;
  error: string | null;
  addCity: (cityName: string) => Promise<void>;
  removeCity: (cityName: string) => void;
}

export const useCityManagement = (): UseCityManagementReturn => {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCity = useCallback(
    async (cityName: string) => {
      if (!cityName.trim()) return;

      setLoading(true);
      setError(null);

      try {
        if (
          cities.some((c) => c.city.toLowerCase() === cityName.toLowerCase())
        ) {
          throw new Error("City already added");
        }

        const coords = await getCoordinates(cityName);
        if (!coords) {
          throw new Error("City not found");
        }

        const forecast = await getWeatherForecast(coords.lat, coords.lon);

        setCities((prev) => [
          ...prev,
          {
            city: cityName,
            data: forecast.list,
            color: CITY_COLORS[prev.length % CITY_COLORS.length],
          },
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cities]
  );

  const removeCity = useCallback((cityName: string) => {
    setCities((prev) => prev.filter((c) => c.city !== cityName));
  }, []);

  return {
    cities,
    loading,
    error,
    addCity,
    removeCity,
  };
};
