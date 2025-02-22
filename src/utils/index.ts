import { METRIC_LABELS, DECIMAL_PLACES, DATE_FORMATS } from "../constants";
import {
  WeatherData,
  CityWeather,
  MetricType,
  CityMetricData,
  ProcessedCityData,
  FormattedWeatherData,
} from "../types";

export const calculateDailyAverage = (
  values: WeatherData[]
): CityMetricData => ({
  temperature: Number(
    (values.reduce((a, b) => a + b.main.temp, 0) / values.length).toFixed(
      DECIMAL_PLACES
    )
  ),
  pressure: Number(
    (values.reduce((a, b) => a + b.main.pressure, 0) / values.length).toFixed(
      DECIMAL_PLACES
    )
  ),
  humidity: Number(
    (values.reduce((a, b) => a + b.main.humidity, 0) / values.length).toFixed(
      DECIMAL_PLACES
    )
  ),
  wind: Number(
    (values.reduce((a, b) => a + b.wind.speed, 0) / values.length).toFixed(
      DECIMAL_PLACES
    )
  ),
});

export const getMetricLabel = (type: MetricType): string => {
  return METRIC_LABELS[type] || "";
};

export const formatDateTime = (timestamp: number, isDaily: boolean): string => {
  const date = new Date(timestamp * 1000);

  if (isDaily) {
    return date.toLocaleDateString(undefined, {
      month: DATE_FORMATS.DAILY.MONTH,
      day: DATE_FORMATS.DAILY.DAY,
    });
  }

  return date.toLocaleString(undefined, {
    month: DATE_FORMATS.HOURLY.MONTH,
    day: DATE_FORMATS.HOURLY.DAY,
    hour: DATE_FORMATS.HOURLY.HOUR,
    minute: DATE_FORMATS.HOURLY.MINUTE,
  });
};

export const processDailyData = (
  city: CityWeather,
  timePoints: Set<string>,
  cityData: ProcessedCityData
): void => {
  const dailyData = city.data.reduce<Record<string, WeatherData[]>>(
    (acc, curr) => {
      const date = formatDateTime(curr.dt, true);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      timePoints.add(date);
      return acc;
    },
    {}
  );

  Object.entries(dailyData).forEach(([date, values]) => {
    if (!cityData[date]) cityData[date] = {};
    cityData[date][city.city] = calculateDailyAverage(values);
  });
};

export const processHourlyData = (
  city: CityWeather,
  timePoints: Set<string>,
  cityData: ProcessedCityData
): void => {
  city.data.forEach((item) => {
    const date = formatDateTime(item.dt, false);
    timePoints.add(date);
    if (!cityData[date]) cityData[date] = {};
    cityData[date][city.city] = {
      temperature: Number(item.main.temp.toFixed(DECIMAL_PLACES)),
      pressure: Number(item.main.pressure.toFixed(DECIMAL_PLACES)),
      humidity: Number(item.main.humidity.toFixed(DECIMAL_PLACES)),
      wind: Number(item.wind.speed.toFixed(DECIMAL_PLACES)),
    };
  });
};

export const formatChartData = (
  timePoints: Set<string>,
  cityData: ProcessedCityData,
  cities: CityWeather[],
  metricType: MetricType
): FormattedWeatherData[] => {
  return Array.from(timePoints)
    .sort()
    .map((date) => ({
      date,
      ...Object.fromEntries(
        cities.map((city) => [
          city.city,
          {
            ...cityData[date][city.city],
            [metricType]: cityData[date][city.city][metricType],
          },
        ])
      ),
    }));
};
