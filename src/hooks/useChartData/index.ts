import { useMemo } from "react";

import {
  CityWeather,
  MetricType,
  Granularity,
  FormattedWeatherData,
} from "../../types";
import {
  processDailyData,
  processHourlyData,
  formatChartData,
} from "../../utils";

export const useChartData = (
  cities: CityWeather[],
  metricType: MetricType,
  granularity: Granularity
): FormattedWeatherData[] => {
  return useMemo(() => {
    if (cities.length === 0) return [];

    const timePoints = new Set<string>();
    const cityData = {};

    cities.forEach((city) => {
      if (granularity === Granularity.Daily) {
        processDailyData(city, timePoints, cityData);
      } else {
        processHourlyData(city, timePoints, cityData);
      }
    });

    return formatChartData(timePoints, cityData, cities, metricType);
  }, [cities, metricType, granularity]);
};
